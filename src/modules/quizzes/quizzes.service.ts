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
import {
  TGetCreateAuthDetailsReturn,
  TGetUpdateAuthDetailsReturn,
} from './types';
import { getCreateAuthDetailsQuery } from './sql/getQueries';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    const {
      Questions,
      courseId,
      lessonId,
      unitId,
      order,
      title,
      ...QuizMetaData
    } = createQuizDto;

    return this.prisma.quiz.create({
      data: {
        courseId,
        lessonId,
        unitId,
        order,
        title,
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
        QuizMetaData: {
          create: {
            ...QuizMetaData,
          },
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

  async getCreateAuthDetails(
    inputs: CreateQuizDto,
    userId: UserProfile['userId'],
  ): Promise<TGetCreateAuthDetailsReturn | null | undefined> {
    const [query, params] = getCreateAuthDetailsQuery({
      courseId: inputs.courseId,
      userId: userId,
      lessonId: inputs.lessonId,
      unitId: inputs.unitId,
    });
    const [data] = await this.prisma.$queryRawUnsafe<
      TGetCreateAuthDetailsReturn[]
    >(query, ...params);
    return data;
  }

  validateCreateAuthDetails(
    details: TGetCreateAuthDetailsReturn | null | undefined,
    inputs: CreateQuizDto,
  ) {
    if (!details) {
      throw new BadRequestException(
        `No such course with the given "courseId" exists.`,
      );
    }
    // If the access is forbidden
    if (!details.instructorState) {
      throw new ForbiddenException(
        `You have no access to add quizzes to this course.`,
      );
    }
    if (details.instructorState !== 'active') {
      throw new ForbiddenException(
        `Your role' state as Instructor in this course is not active at the moment.`,
      );
    }
    if (details.instructorEndsAt && details.instructorEndsAt < new Date()) {
      throw new ForbiddenException(
        `Your role' as Instructor in this course has expired.`,
      );
    }
    // Check the course state
    if (details.courseState == 'available') {
      throw new BadRequestException(
        `This course state is "available" You can not edit it at the current state.`,
      );
    }

    if (inputs.unitId && !details.unitState) {
      throw new BadRequestException(
        `No such unit with the given "unitId" exists in this course.`,
      );
    }
    if (inputs.lessonId) {
      if (!details.lessonState) {
        throw new BadRequestException(
          `No such lesson with the given "lessonId" exists in this course.`,
        );
      }
      if (inputs.unitId && details.unitId != inputs.unitId) {
        // You can correct it or throw, I will throw for simplicity + it shouldn't happen to missmatch
        throw new BadRequestException(
          `This lessonId doesn't belong to this unitId, please fix it.`,
        );
      } else {
        inputs.unitId = details.unitId;
      }
    }
    return true;
  }

  async getUpdateAuthDetails(
    quizId: Quiz['quizId'],
    instructorId: number,
    updateQuizDto: UpdateQuizDto,
  ): Promise<TGetUpdateAuthDetailsReturn | null | undefined> {
    const data = await this.prisma.quiz.findFirst({
      where: {
        quizId: quizId,
      },
      select: {
        Questions: {
          select: {
            quizQuestionId: true,
            Options: {
              select: {
                quizeQuestionOptionId: true,
              },
            },
          },
        },
        state: true,
        unitId: true,
        lessonId: true,
        courseId: true,
        QuizMetaData: true,
        Course: {
          select: {
            state: true,
            Instructors: {
              where: {
                instructorId: instructorId,
              },
              select: {
                courseInstructorId: true,
                position: true,
                state: true,
                endsAt: true,
              },
            },
            ...(updateQuizDto.unitId
              ? {
                  Units: {
                    where: { unitId: updateQuizDto.unitId },
                    select: {
                      state: true,
                    },
                  },
                }
              : {}),
            ...(updateQuizDto.lessonId
              ? {
                  Lessons: {
                    where: { lessonId: updateQuizDto.lessonId },
                    select: {
                      state: true,
                      unitId: true,
                    },
                  },
                }
              : {}),
          },
        },
      },
    });
    return data;
  }

  validateUpdateAuthDetails(
    details: TGetUpdateAuthDetailsReturn | null | undefined,
    updateQuizDto: UpdateQuizDto,
  ) {
    if (!details) {
      throw new NotFoundException(`This quiz doesn't exist`);
    }
    if (!details.Course.Instructors[0]) {
      throw new ForbiddenException(`You have no access to modify this quiz`);
    }
    if (details.Course.Instructors[0].state !== 'active') {
      throw new ForbiddenException(`Your access to this course is not active`);
    }
    if (updateQuizDto.unitId) {
      if (!details.Course.Units[0]) {
        throw new BadRequestException(
          `No such unit with the given "unitId" exists in this course.`,
        );
      }
      if (updateQuizDto.lessonId) {
        if (!details.Course.Lessons[0]) {
          throw new BadRequestException(
            `No such lesson with the given "lessonId" exists in this course.`,
          );
        }
        if (details.Course.Lessons[0].unitId !== updateQuizDto.unitId) {
          throw new BadRequestException(
            `This lesson doesn't exist in this unit`,
          );
        }
      } else {
        updateQuizDto.lessonId = null;
      }
    } else if (updateQuizDto.lessonId) {
      if (!details.Course.Lessons[0]) {
        throw new BadRequestException(
          `No such lesson with the given "lessonId" exists in this course.`,
        );
      }
      updateQuizDto.unitId = details.Course.Lessons[0].unitId;
    }
    if (updateQuizDto.Questions) {
      for (const { quizQuestionId, Options } of updateQuizDto.Questions) {
        if (quizQuestionId) {
          const questionDetails = details.Questions.find(
            (q) => q.quizQuestionId == quizQuestionId,
          );
          if (!questionDetails) {
            throw new BadRequestException(
              `No such question (${quizQuestionId}) in this quiz`,
            );
          }
          if (Options) {
            for (const { quizeQuestionOptionId } of Options) {
              if (
                quizeQuestionOptionId &&
                !questionDetails.Options.find(
                  (qo) => qo.quizeQuestionOptionId == quizeQuestionOptionId,
                )
              ) {
                throw new BadRequestException(
                  `No such option in this quiz question`,
                );
              }
            }
          }
        } else {
          if (Options && Options.find((o) => !!o.quizeQuestionOptionId)) {
            throw new BadRequestException(
              `You can't update an existing option for a none existing question`,
            );
          }
        }
      }
    }
    return true;
  }

  async update(id: number, { Questions, ...updateQuizDto }: UpdateQuizDto) {
    const { lessonId, unitId, order, title, ...QuizMetaData } = updateQuizDto;

    const data = {
      lessonId,
      unitId,
      order,
      title,
    } as Prisma.QuizUpdateInput;

    if (Questions) {
      data.Questions = {
        upsert: [],
      };
      const upsertedData = data.Questions
        .upsert as Prisma.QuizQuestionUpsertWithWhereUniqueWithoutQuizInput[];
      let i = 0;
      for (const { quizQuestionId, Options, ...question } of Questions) {
        upsertedData.push({
          where: { quizQuestionId: quizQuestionId || -1 },
          update: {
            ...question,
          },
          create: {
            ...question,
          },
        });
        if (Options) {
          i = upsertedData.length - 1;
          upsertedData[i].update.Options = {
            upsert: [],
          };
          upsertedData[i].create.Options = {
            createMany: {
              data: [],
            },
          };
          for (const { quizeQuestionOptionId, ...o } of Options) {
            (
              upsertedData[i].update.Options
                .upsert as Prisma.QuizQuestionOptionUpsertWithWhereUniqueWithoutQuestionInput[]
            ).push({
              where: {
                quizeQuestionOptionId: quizeQuestionOptionId || -1,
              },
              update: o,
              create: o,
            });
            (
              upsertedData[i].create.Options.createMany
                .data as Prisma.QuizQuestionOptionCreateManyQuestionInput[]
            ).push(o);
          }
        }
      }
    }
    if (Object.keys(QuizMetaData).length) {
      data.QuizMetaData = {
        update: QuizMetaData,
      };
    }
    console.log(1);
    
    return this.prisma.quiz.update({
      where: { quizId: id },
      data: data,
      select: {
        updatedAt: true,
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
        QuizMetaData: {
          startsAt: { gte: start },
          endsAt: { lte: end },
        },
      },
    });
  }

  async authHard({ quizId, userId }: { userId: number; quizId: number }) {
    // selecting it this way to check if the quiz exists, then the possibility of accessing it
    // for better informative messages (maybe just for development ?)
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
      const dataUpdatePromise = tx.quizMetaData.updateMany({
        where: {
          quizId: inputs.quizId,
        },
        data: {
          fullGrade: fullGrade,
          passGrade: passGrade,
        },
      });
      if (inputs.auto) {
        const updateResult = await Promise.all([
          tx.quiz.updateMany({
            where: {
              quizId: inputs.quizId,
            },
            data: {
              state: inputs.state || 'calculatedGrades',
            },
          }),
          dataUpdatePromise,
        ]);

        return {
          fullGrade,
          passGrade,
          updateResult: updateResult[0].count,
        };
      }
      const updateResult = await Promise.all([
        tx.quiz.update({
          where: {
            quizId: inputs.quizId,
          },
          data: {
            state: inputs.state || 'calculatedGrades',
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
          select: {
            courseId: true,
            unitId: true,
            lessonId: true,
          },
        }),
        dataUpdatePromise,
      ]);

      return {
        fullGrade,
        passGrade,
        updateResult: updateResult[0],
      };
    });

    return result;
  }
}
