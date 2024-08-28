import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CourseEnrollmentState,
  CourseInstructorPositions,
  CourseState,
  Prisma,
  Quiz,
  UserProfile,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import {
  TGetCreateAuthDetailsReturn,
  TGetUpdateAuthDetailsReturn,
} from './types';

import { GetManyQuizzesQueryDto } from './dto/queries/get-many-quizzes-query.dto';
import { QuizzesRepository } from './repositories/quizzes.repository';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: QuizzesRepository,
  ) {}

  async authInstructorHardPerQuiz(inputs: { userId: number; quizId: number }) {
    const details = await this.repo.getInstructorAuthPerQuizQuery(inputs);

    if (!details) {
      throw new NotFoundException(`This quiz doesn't exist`);
    }
    if (!details.instructorId) {
      throw new ForbiddenException(`You have no access to edit this quiz`);
    }

    return true;
  }

  validateInstructorPerQuiz(
    details:
      | {
          course: {
            state: CourseState;
            courseInstructors: {
              state: CourseEnrollmentState;
              position: CourseInstructorPositions;
              endsAt: Date;
            }[];
          };
        }
      | undefined
      | null,
  ) {
    if (!details) {
      throw new NotFoundException(`This quiz doesn't exist`);
    }
    if (!details.course.courseInstructors[0]) {
      throw new ForbiddenException(`You have no access to edit this quiz`);
    }
  }

  async authInstructorHard(inputs: { courseId: number; userId: number }) {
    const data = await this.repo.getInstructorAuthForCourseQuery(inputs);
    if (!data) {
      throw new NotFoundException(`This course doesn't exist`);
    }
    if (!data.courseInstructorId) {
      throw new ForbiddenException(`You have no access to this course`);
    }
    if (data.enrollmentState !== 'active') {
      throw new ForbiddenException(`Your state as an instructor is not active`);
    }
    if (data.endsAt && data.endsAt < new Date()) {
      throw new ForbiddenException(`Your role as an instructor has ended`);
    }
    return data;
  }

  async authStudentHard({
    courseId,
    userId,
  }: {
    userId: number;
    courseId: number;
  }) {
    const details = await this.repo.getStudentAuthQuery({ courseId, userId });
    if (!details) {
      throw new NotFoundException(`This course doesn't exist`);
    }
    if (!details.enrollmentState) {
      throw new ForbiddenException(`You are not enrolled in this course`);
    }
    if (details.enrollmentState !== 'active') {
      throw new BadRequestException(
        `Your enrollment in this course is not active`,
      );
    }
    if (details.endsAt && details.endsAt < new Date()) {
      throw new BadRequestException(`Your enrollment in this course has ended`);
    }
    return details;
  }

  async authStudentHardPerQuiz({
    quizId,
    userId,
  }: {
    userId: number;
    quizId: number;
  }) {
    const details = await this.repo.getStudentAuthPerQuizQuery({
      quizId,
      userId,
    });

    if (!details) {
      throw new NotFoundException(`This quiz doesn't exist`);
    }
    if (!details.enrollmentState) {
      throw new ForbiddenException(`You are not enrolled in this course`);
    }
    if (details.enrollmentState !== 'active') {
      throw new BadRequestException(
        `Your enrollment in this course is not active`,
      );
    }
    if (details.endsAt && details.endsAt < new Date()) {
      throw new BadRequestException(`Your enrollment in this course has ended`);
    }

    return details;
  }

  validatestudentPerQuiz(
    details: Awaited<
      ReturnType<QuizzesService['repo']['getStudentOneWithAuth']>
    >,
  ) {
    if (!details) {
      throw new NotFoundException(`This quiz doesn't exist`);
    }
    if (details.state != 'available') {
      throw new NotFoundException(`This quiz is not available`);
    }
    if (!details.course.courseEnrollments[0]) {
      throw new ForbiddenException(`You have no access to edit this quiz`);
    }
    if (
      details.quizMetaData[0].attemptsAllowed &&
      details.quizMetaData[0].startsAt < new Date()
    ) {
      if (!details.quizSubmissions[0]) {
        throw new ForbiddenException(`You can't see this quiz yet`);
      }
    }
  }

  async findManyForStudent(query: GetManyQuizzesQueryDto) {
    const data = await this.repo.getManyQuizzesForStudentQuery(query);
    if (data.length > query.quizPageSize) {
      data.pop();
      return {
        data: data,
        hasMore: true,
      };
    }
    return {
      data: data,
      hasMore: false,
    };
  }

  async findManyForInstructor(query: GetManyQuizzesQueryDto) {
    const data = await this.repo.getManyQuizzesForInstructorQuery(query);
    if (data.length > query.quizPageSize) {
      data.pop();
      return {
        data: data,
        hasMore: true,
      };
    }
    return {
      data: data,
      hasMore: false,
    };
  }

  async findInstructorOneWithAuth(inputs: { userId: number; quizId: number }) {
    const details = await this.repo.getInstructorOneWithAuth(inputs);
    this.validateInstructorPerQuiz(details);
    delete details.course;
    return details as Omit<typeof details, 'course'>;
  }

  async findStudentOneWithAuth(inputs: { userId: number; quizId: number }) {
    const details = await this.repo.getStudentOneWithAuth(inputs);
    this.validatestudentPerQuiz(details);
    delete details.course;
    return details as Omit<typeof details, 'course'>;
  }

  // CREATE
  async getCreateAuthDetails(
    inputs: CreateQuizDto,
    userId: UserProfile['userId'],
  ): Promise<TGetCreateAuthDetailsReturn | null | undefined> {
    const data = await this.repo.getCreateAuthDetailsQuery({
      courseId: inputs.courseId,
      lessonId: inputs.lessonId,
      unitId: inputs.unitId,
      userId: userId,
    });
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

  // UPDATE
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

  // Some Modifications
  async markAsAvailable(inputs: {
    quizId: Quiz['quizId'];
    passGrade?: number;
    auto?: boolean;
    state?: 'available' | 'calculated_grades';
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
              state: inputs.state || 'calculated_grades',
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
            state: inputs.state || 'calculated_grades',
            Course: {
              update: {
                state: 'calculated_grades',
              },
            },
            Unit: {
              update: {
                state: 'calculated_grades',
              },
            },
            Lesson: {
              update: {
                state: 'calculated_grades',
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

  async remove(id: number) {
    return this.prisma.quiz.delete({
      where: { quizId: id },
    });
  }
}
