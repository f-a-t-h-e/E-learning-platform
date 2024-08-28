import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Unit } from '@prisma/client';
import { getStatesForCalculatingGrades } from 'src/common/utils/getStatesForCalculatingGrades';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class UnitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lessonsService: LessonsService,
  ) {}
  async create(createUnitDto: CreateUnitDto, userId: number) {
    const unit = await this.prisma.unit.create({
      data: {
        title: createUnitDto.title,
        description: createUnitDto.description,
        userId: userId,
        courseId: createUnitDto.courseId,
        order: createUnitDto.order,
        quizFullGrade: 0,
      },
    });
    return unit;
  }

  async findAll(courseId: number) {
    const Units = await this.prisma.unit.findMany({
      where: {
        courseId: courseId,
      },
    });
    return Units;
  }

  async findOne(unitId: number) {
    const unit = await this.prisma.unit.findFirst({
      where: { unitId: unitId },
    });
    return unit;
  }

  async update(id: number, updateUnitDto: UpdateUnitDto, courseId: number) {
    const unit = await this.prisma.unit.update({
      where: {
        unitId: id,
        courseId: courseId,
      },
      data: {
        ...updateUnitDto,
      },
    });
    return unit;
  }

  async remove(id: number, courseId: number) {
    const unit = await this.prisma.unit.delete({
      where: {
        unitId: id,
        courseId: courseId,
      },
    });
    return unit;
  }

  async getCourseFromUserIdAndUnitId(userId: number, unitId: number) {
    const foundResult = await this.prisma.unit.findFirst({
      where: {
        unitId: unitId,
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
      },
    });
    if (foundResult) {
      return foundResult;
    }
    return false as const;
  }

  async updateBanner(unitId: Unit['unitId'], url: string) {
    await this.prisma.unit.updateMany({
      where: {
        unitId: unitId,
      },
      data: {
        banner: url,
      },
    });
    // @todo You can do some notification in case you want to get closer to a social media platform
  }

  async markAsAvailable(inputs: {
    unitId: number;
    quizPassGrade?: number;
    auto?: boolean;
    allStates?: boolean;
    state?: 'available' | 'calculated_grades';
  }) {
    const targetState = getStatesForCalculatingGrades(inputs.state);
    if (inputs.auto) {
      const lessons = await this.prisma.lesson.findMany({
        where: {
          unitId: inputs.unitId,
          state: inputs.allStates
            ? { in: ['available', 'calculated_grades', 'created'] }
            : { in: targetState },
        },
      });
      for (const lesson of lessons) {
        // @todo track failure
        await this.lessonsService.markAsAvailable({
          lessonId: lesson.lessonId,
          auto: true,
          state: inputs.state,
          allStates: inputs.allStates,
        });
      }
    }
    const result = await this.prisma.useTransaction(async (tx) => {
      const sumLesson = await tx.lesson.aggregate({
        where: { unitId: inputs.unitId, state: { in: targetState } },
        _sum: {
          quizFullGrade: true,
          quizPassGrade: true,
        },
      });
      const sumQuiz = await tx.quizMetaData.aggregate({
        where: {
          Quiz: {
            unitId: inputs.unitId,
            lessonId: null,
            state: { in: targetState },
          },
        },
        _sum: {
          fullGrade: true,
          passGrade: true,
        },
      });
      const quizFullGrade =
        sumLesson._sum.quizFullGrade + sumQuiz._sum.fullGrade;
      const quizPassGrade =
        typeof inputs.quizPassGrade == 'number'
          ? inputs.quizPassGrade
          : sumLesson._sum.quizPassGrade + sumQuiz._sum.passGrade;
      if (inputs.auto) {
        const updateResult = await tx.unit.updateMany({
          where: {
            unitId: inputs.unitId,
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
          updateResult: updateResult,
        };
      }
      const updateResult = await tx.unit.update({
        where: {
          unitId: inputs.unitId,
        },
        data: {
          state: inputs.state || 'calculated_grades',
          quizFullGrade: quizFullGrade,
          quizPassGrade: quizPassGrade,
          Course: {
            update: {
              state: 'calculated_grades',
            },
          },
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

  async authHard({ unitId, userId }: { userId: number; unitId: number }) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        unitId: unitId,
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
    if (!unit) {
      throw new NotFoundException(`This unit doesn't exist`);
    }
    if (!unit.Course.Instructors.find((i) => i.instructorId == userId)) {
      throw new ForbiddenException(`You have no access to edit this unit`);
    }
    return true;
  }
}
