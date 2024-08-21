import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Course, Prisma, UserProfile } from '@prisma/client';
import { getStatesForCalculatingGrades } from 'src/common/utils/getStatesForCalculatingGrades';
import { UnitsService } from '../units/units.service';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private readonly unitsService: UnitsService,
  ) {}
  async create(
    createCourseDto: CreateCourseDto,
    userId: UserProfile['userId'],
  ) {
    const course = await this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        quizFullGrade: 0,
        state: 'created',
        Instructors: {
          create: {
            position: 'owner',
            instructorId: userId,
            state: 'active',
          },
        },
      },
    });
    return course;
  }

  async findAll() {
    const courses = await this.prisma.course.findMany();
    return courses;
  }

  async findOne(
    id: number,
    options = {} as {
      getUnits?: boolean;
      getLessons?: boolean;
      getCourseMaterial?: boolean;
      allMaterialState?: boolean;
    },
  ) {
    const include: Prisma.CourseInclude = {};
    if (options.getUnits) {
      include.Units = {
        select: {
          unitId: true,
          title: true,
          description: true,
          createdAt: true,
          banner: true,
        },
      };
      if (options.getLessons) {
        include.Units.select = {
          ...include.Units.select,
          Lessons: {
            select: {
              lessonId: true,
              title: true,
              description: true,
              banner: true,
              createdAt: true,
            },
          },
        };
      }
    } else if (options.getLessons) {
      include.Lessons = {
        select: {
          lessonId: true,
          title: true,
          description: true,
          banner: true,
          createdAt: true,
        },
      };
    }
    if (options.getCourseMaterial) {
      include.Media = {
        where: {
          lessonId: null,
          unitId: null,
        },
        select: {
          courseMediaId: true,
          target: true,
          type: true,
          extension: true,
          url: true,
          updatedAt: true,
        },
      };
      if (!options.allMaterialState) {
        include.Media.where.state = 'uploaded';
      }
    }
    const course = await this.prisma.course.findFirst({
      where: { courseId: id },
      include: include,
    });
    return course;
  }

  async authHard({ courseId, userId }: { userId: number; courseId: number }) {
    const course = await this.prisma.course.findFirst({
      where: {
        courseId: courseId,
      },
      select: {
        Instructors: {
          where: {
            instructorId: userId,
          },
          select: { instructorId: true, position: true },
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`This course doesn't exist`);
    }
    if (!course.Instructors.find((i) => i.instructorId == userId)) {
      throw new ForbiddenException(`You have no access to edit this course`);
    }
    return true;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    await this.prisma.course.updateMany({
      where: {
        courseId: id,
      },
      data: {
        ...updateCourseDto,
      },
    });
    return true;
  }

  async remove(id: number) {
    await this.prisma.course.deleteMany({
      where: {
        courseId: id,
      },
    });
    return true;
  }

  async isUserATeacherAtCourse(userId: number, courseId: number) {
    const instructore = await this.prisma.courseInstructor.findFirst({
      where: {
        courseId: courseId,
        instructorId: userId,
      },
      select: {
        position: true,
      },
    });

    return TEACHERS_POSITIONS.includes(instructore.position) && instructore;
  }

  async updateBanner(id: Course['courseId'], url: string) {
    await this.prisma.course.updateMany({
      where: {
        courseId: id,
      },
      data: {
        banner: url,
      },
    });
    // @todo You can do some notification in case you want to get closer to a social media platform
  }

  async markAsAvailable(inputs: {
    courseId: Course['courseId'];
    quizPassGrade?: number;
    auto?: boolean;
    // Calculate all and ignore the states
    allStates?: boolean;
    state?: 'available' | 'calculatedGrades';
  }) {
    const targetState = getStatesForCalculatingGrades(inputs.state);
    if (inputs.auto) {
      const units = await this.prisma.unit.findMany({
        where: {
          courseId: inputs.courseId,
          state: inputs.allStates
            ? { in: ['available', 'calculatedGrades', 'created'] }
            : { in: targetState },
        },
      });
      for (const unit of units) {
        // @todo track failure
        await this.unitsService.markAsAvailable({
          unitId: unit.unitId,
          auto: true,
          state: inputs.state,
          allStates: inputs.allStates,
        });
      }
    }
    const result = await this.prisma.useTransaction(async (tx) => {
      const sumUnit = await tx.unit.aggregate({
        where: { courseId: inputs.courseId, state: { in: targetState } },
        _sum: {
          quizFullGrade: true,
          quizPassGrade: true,
        },
      });
      const sumQuiz = await tx.quiz.aggregate({
        where: {
          courseId: inputs.courseId,
          unitId: null,
          lessonId: null,
          state: { in: targetState },
        },
        _sum: {
          fullGrade: true,
          passGrade: true,
        },
      });
      const quizFullGrade = sumUnit._sum.quizFullGrade + sumQuiz._sum.fullGrade;
      const quizPassGrade =
        typeof inputs.quizPassGrade == 'number'
          ? inputs.quizPassGrade
          : sumUnit._sum.quizPassGrade + sumQuiz._sum.passGrade;
      const updateResult = await tx.course.updateMany({
        where: {
          courseId: inputs.courseId,
        },
        data: {
          state: inputs.state || 'calculatedGrades',
          quizFullGrade: quizFullGrade,
          quizPassGrade: quizPassGrade,
        },
      });
      return {
        quizFullGrade,
        quizPassGrade,
        updateResult: updateResult.count,
      };
    });

    return result;
  }
}

const TEACHERS_POSITIONS = ['OWNER', 'TEACHER'];
