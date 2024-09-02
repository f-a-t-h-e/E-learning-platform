import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from '../../../../../common/prisma/prisma.service';
import { Lesson, Prisma, UserProfile } from '@prisma/client';
import { getStatesForCalculatingGrades } from '../../common/utils/getStatesForCalculatingGrades';
import { QuizzesService } from '../quizzes/quizzes.service';
import { objOrNothing } from '../../common/utils/objOrNothing';

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly quizzesService: QuizzesService,
  ) {}
  async create(
    createLessonDto: CreateLessonDto,
    userId: UserProfile['userId'],
  ) {
    const lesson = await this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        description: createLessonDto.description,
        userId: userId,
        courseId: createLessonDto.courseId,
        unitId: createLessonDto.unitId,
        quizFullGrade: 0,
        order: createLessonDto.order,
      },
    });
    return lesson;
  }

  async findAll(unitId: number, getContent?: boolean) {
    const include = getContent
      ? {
          LessonContent: true,
        }
      : undefined;
    const lessons = await this.prisma.lesson.findMany({
      where: {
        unitId: unitId,
      },
      include: include,
    });
    return lessons;
  }

  async findOne(id: number, getContent?: boolean) {
    const include = getContent
      ? {
          LessonContent: true,
        }
      : undefined;
    const lesson = await this.prisma.lesson.findFirst({
      where: { lessonId: id },
      include,
    });
    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto, courseId: number) {
    const lesson = await this.prisma.lesson.update({
      where: {
        lessonId: id,
        courseId: courseId,
      },
      data: {
        ...updateLessonDto,
      },
    });
    return lesson;
  }

  async remove(id: number, courseId: number) {
    const lesson = await this.prisma.lesson.delete({
      where: {
        lessonId: id,
        courseId: courseId,
      },
    });
    return lesson;
  }

  async markAsAvailable(inputs: {
    lessonId: number;
    quizPassGrade?: number;
    auto?: boolean;
    allStates?: boolean;
    state?: 'available' | 'calculated_grades';
  }) {
    const targetState = getStatesForCalculatingGrades(inputs.state);
    if (inputs.auto) {
      const quizzes = await this.prisma.quiz.findMany({
        where: {
          lessonId: inputs.lessonId,
          state: inputs.allStates
            ? { in: ['available', 'calculated_grades', 'created'] }
            : { in: targetState },
        },
      });
      for (const quiz of quizzes) {
        // @todo track failure
        await this.quizzesService.markAsAvailable({
          quizId: quiz.quizId,
          auto: true,
          state: inputs.state,
        });
      }
    }
    const result = await this.prisma.useTransaction(async (tx) => {
      const sums = await tx.quizMetaData.aggregate({
        where: {
          Quiz: {
            lessonId: inputs.lessonId,
            state: { in: targetState },
          },
        },
        _sum: {
          fullGrade: true,
          passGrade: true,
        },
      });
      const quizFullGrade = sums._sum.fullGrade;
      const quizPassGrade =
        typeof inputs.quizPassGrade == 'number'
          ? inputs.quizPassGrade
          : sums._sum.passGrade;
      if (inputs.auto) {
        const updateResult = await tx.lesson.updateMany({
          where: {
            lessonId: inputs.lessonId,
          },
          data: {
            state: inputs.state || 'calculated_grades',
            quizFullGrade: quizFullGrade,
            quizPassGrade: quizPassGrade,
          },
        });
        return {
          quizFullGrade,
          quizPassGrade,
          updateResult: updateResult.count,
        };
      }
      const currentLesson = await tx.lesson.findUniqueOrThrow({
        where: { lessonId: inputs.lessonId },
        select: {
          quizFullGrade: true,
          quizPassGrade: true,
          unitId: true,
        },
      });
      const quizFullGradeDiff =
        quizFullGrade - (currentLesson.quizFullGrade || 0);
      const quizPassGradeDiff =
        typeof quizPassGrade == 'number'
          ? quizPassGrade - (currentLesson.quizPassGrade || 0)
          : 0;
      const extraUpdates: Prisma.LessonUpdateInput = {};
      if (Math.abs(quizFullGradeDiff || quizPassGradeDiff) >= 1) {
        const quizFullGrade = objOrNothing(
          { quizFullGrade: { increment: Math.floor(quizFullGradeDiff) } },
          Math.abs(quizFullGradeDiff) >= 1,
        );
        const quizPassGrade = objOrNothing(
          { quizPassGrade: { increment: Math.floor(quizPassGradeDiff) } },
          Math.abs(quizPassGradeDiff) >= 1,
        );
        extraUpdates.Course = {
          update: {
            ...quizFullGrade,
            ...quizPassGrade,
          },
        };
        if (currentLesson.unitId) {
          extraUpdates.Unit = {
            update: {
              ...quizFullGrade,
              ...quizPassGrade,
            },
          };
        }
      }
      const updateResult = await tx.lesson.update({
        where: {
          lessonId: inputs.lessonId,
        },
        data: {
          state: inputs.state || 'calculated_grades',
          quizFullGrade: quizFullGrade,
          quizPassGrade: quizPassGrade,
          ...extraUpdates,
        },
      });

      return {
        quizFullGrade,
        quizPassGrade,
        updateResult: updateResult,
      };
    });

    return result;
  }
  // authorization methods
  async authHard({ lessonId, userId }: { userId: number; lessonId: number }) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        lessonId: lessonId,
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
    if (!lesson) {
      throw new NotFoundException(`This lesson doesn't exist`);
    }
    if (!lesson.Course.Instructors.find((i) => i.instructorId == userId)) {
      throw new ForbiddenException(`You have no access to edit this lesson`);
    }
    return true;
  }
  async canUserEditLesson(userId: number, lessonId: number) {
    const foundResult = await this.prisma.lesson.findFirst({
      where: {
        lessonId: lessonId,
        Course: {
          Instructors: {
            some: {
              instructorId: userId,
            },
          },
        },
      },
      select: {
        userId: true,
      },
    });
    if (foundResult) {
      return true;
    }
    return false;
  }
  async getCourseFromUserIdAndLessonId(userId: number, lessonId: number) {
    const foundResult = await this.prisma.lesson.findFirst({
      where: {
        lessonId: lessonId,
        Course: {
          Instructors: {
            some: {
              instructorId: userId,
            },
          },
        },
      },
      select: {
        courseId: true,
        unitId: true,
      },
    });
    if (foundResult) {
      return foundResult;
    }
    return false as const;
  }

  async updateBanner(id: Lesson['lessonId'], url: string) {
    await this.prisma.lesson.updateMany({
      where: {
        lessonId: id,
      },
      data: {
        banner: url,
      },
    });
    // @todo You can do some notification in case you want to get closer to a social media platform
  }
}
