import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Prisma, Quiz, UserProfile } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async checkRefrencesHard(
    inputs: CreateQuizDto | UpdateQuizDto,
    userId: UserProfile['userId'],
  ) {
    const courseId = inputs.courseId;
    const unitId = inputs.unitId;
    const lessonId = inputs.lessonId;
    const select: Prisma.CourseSelect = {
      courseId: true,
      state: true,
      Instructors: {
        where: {
          instructorId: userId,
        },
        select: {
          position: true,
          state: true,
          endsAt: true,
        },
      },
    };
    if (unitId) {
      select.Units = {
        where: {
          unitId: unitId,
        },
        select: {
          state: true,
          userId: true,
        },
      };
    }
    if (lessonId) {
      select.Lessons = {
        where: {
          lessonId: lessonId,
        },
        select: {
          state: true,
          userId: true,
        },
      };
    }
    const data = await this.prisma.course.findFirst({
      where: { courseId: courseId },
      select: select,
    });

    const result = {
      failed: [] as string[],
    };
    if (!data) {
      throw new BadRequestException(
        `No such course with the given "courseId" exists.`,
      );
    }
    // If the access is forbidden
    if (!data.Instructors[0]) {
      throw new ForbiddenException(
        `You have no access to add quizzes to this course.`,
      );
    }
    if (data.Instructors[0].state !== 'active') {
      throw new ForbiddenException(
        `Your role' state as Instructor in this course is not active at the moment.`,
      );
    }
    if (data.Instructors[0].endsAt && data.Instructors[0].endsAt < new Date()) {
      throw new ForbiddenException(
        `Your role' as Instructor in this course has expired.`,
      );
    }
    // Check the course state
    if (data.state == 'available') {
      throw new BadRequestException(
        `This course state is "available" You can not edit it at the current state.`,
      );
    }

    if (unitId && !data.Units[0]) {
      throw new BadRequestException(
        `No such unit with the given "unitId" exists in this course.`,
      );
    }
    if (lessonId) {
      if (!data.Lessons[0]) {
        throw new BadRequestException(
          `No such lesson with the given "lessonId" exists in this course.`,
        );
      }
      if (unitId && data.Lessons[0].unitId != unitId) {
        // You can correct it or throw, I will throw for simplicity + it shouldn't happen to missmatch
        throw new BadRequestException(
          `This lessonId doesn't belong to this unitId, please fix it.`,
        );
      }
    }
    return true;
  }

  async create(createQuizDto: CreateQuizDto) {
    const { Questions, ...quizData } = createQuizDto;

    return this.prisma.quiz.create({
      data: {
        ...quizData,
        Questions: {
          create: Questions?.map((question) => ({
            ...question,
            Options: {
              create: question.Options?.map((option) => ({
                ...option,
              })),
            },
          })),
        },
      },
      include: {
        Questions: {
          include: {
            Options: true, // Include options if needed
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.quiz.findMany();
  }

  async findOne(id: number) {
    return this.prisma.quiz.findUnique({
      where: { quizId: id },
      include: {
        Questions: {
          include: {
            Options: true,
          },
        },
      },
    });
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    return this.prisma.quiz.update({
      where: { quizId: id },
      data: {
        ...updateQuizDto,
        Questions: {
          upsert: updateQuizDto.Questions?.map(
            ({ quizQuestionId, quizId, ...question }) => ({
              where: { quizQuestionId: quizQuestionId, quizId: id },
              update: {
                ...question,
                Options: {
                  upsert: question.Options?.map((option) => ({
                    where: {
                      quizeQuestionOptionId_questionId: {
                        quizeQuestionOptionId: option.quizeQuestionOptionId,
                        questionId: quizQuestionId,
                      },
                    },
                    update: option,
                    create: option,
                  })),
                },
              },
              create: {
                ...question,
                Options: {
                  create: question.Options?.map((option) => ({
                    ...option,
                  })),
                },
              },
            }),
          ),
        },
      },
      include: {
        Questions: {
          include: {
            Options: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.quiz.delete({
      where: { quizId: id },
    });
  }

  async findByCourseId(courseId: number) {
    return this.prisma.quiz.findMany({
      where: { courseId },
    });
  }

  async findByLessonId(lessonId: number) {
    return this.prisma.quiz.findMany({
      where: { lessonId },
    });
  }

  async findQuizzesByDateRange(start: Date, end: Date) {
    return this.prisma.quiz.findMany({
      where: {
        startsAt: { gte: start },
        endsAt: { lte: end },
      },
    });
  }

  async authHard({ quizId, userId }: { userId: number; quizId: number }) {
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        quizId: quizId,
      },
      select: {
        Course: {
          select: {
            Instructors: {
              where: {
                instructorId: userId,
              },
              select: { instructorId: true, position: true },
            },
          },
        },
      },
    });
    if (!quiz) {
      throw new NotFoundException(`This quiz doesn't exist`);
    }
    if (!quiz.Course.Instructors.find((i) => i.instructorId == userId)) {
      throw new ForbiddenException(`You have no access to edit this quiz`);
    }
    return true;
  }

  async markAsAvailable(inputs: {
    quizId: Quiz['quizId'];
    passGrade?: number;
    auto?: boolean;
    state?: 'available' | 'calculatedGrades';
  }) {
    const result = await this.prisma.useTransaction(async (tx) => {
      const sums = await tx.quizQuestion.aggregate({
        where: { quizId: inputs.quizId },
        _sum: {
          fullGrade: true,
          passGrade: true,
        },
      });
      const fullGrade = sums._sum.fullGrade;
      const passGrade =
        typeof inputs.passGrade == 'number'
          ? inputs.passGrade
          : sums._sum.passGrade;
      if (inputs.auto) {
        const updateResult = await tx.quiz.updateMany({
          where: {
            quizId: inputs.quizId,
          },
          data: {
            state: inputs.state || 'calculatedGrades',
            fullGrade: fullGrade,
            passGrade: passGrade,
          },
        });

        return {
          fullGrade,
          passGrade,
          updateResult: updateResult.count,
        };
      }
      const updateResult = await tx.quiz.update({
        where: {
          quizId: inputs.quizId,
        },
        data: {
          state: inputs.state || 'calculatedGrades',
          fullGrade: fullGrade,
          passGrade: passGrade,
          Course: {
            update: {
              state: 'calculatedGrades',
            },
          },
          Unit: {
            update: {
              state: 'calculatedGrades',
            },
          },
          Lesson: {
            update: {
              state: 'calculatedGrades',
            },
          },
        },
      });

      return {
        fullGrade,
        passGrade,
        updateResult: updateResult,
      };
    });

    return result;
  }
}
