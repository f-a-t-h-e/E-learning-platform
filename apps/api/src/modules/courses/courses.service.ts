import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'common/prisma/prisma.service';
import {
  Course,
  Lesson,
  Prisma,
  Unit,
  UserProfile,
} from '@prisma/client';
import { getStatesForCalculatingGrades } from '../../common/utils/getStatesForCalculatingGrades';
import { UnitsService } from '../units/units.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
import {
  SELECT_MEDIA_PUBLIC,
  SELECT_QUIZ_PUBLIC,
  TSelectQuizPublic,
} from '../../common/other/common-selects';
import { GetOneCourseQueryDto } from './dto/get-one-course-query.dto';

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
    options = {} as GetOneCourseQueryDto,
    allStates?: boolean,
  ) {
    const allQuizzes =
      options.getCourseQuizzes &&
      options.getUnitsQuizzes &&
      options.getLessonsQuizzes &&
      options.getUnits &&
      options.getLessons;
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
        orderBy: { order: 'asc' },
      };
      if (!allStates) {
        include.Units.where = { state: 'available' };
      }
      if (options.getLessons) {
        type T = Prisma.Unit$LessonsArgs<DefaultArgs>;
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
            orderBy: { order: 'asc' },
          },
        };
        if (!allStates) {
          (include.Units.select.Lessons as T).where = { state: 'available' };
        }
        if (!allQuizzes && options.getLessonsQuizzes) {
          (include.Units.select.Lessons as T).select.Quizzes = {
            select: SELECT_QUIZ_PUBLIC,
            orderBy: { order: 'asc' },
          };
          if (!allStates) {
            type TT = Prisma.Lesson$QuizzesArgs<DefaultArgs>;
            ((include.Units.select.Lessons as T).select.Quizzes as TT).where = {
              state: 'available',
            };
          }
        }

        if (options.getLessonsMedia) {
          (include.Units.select.Lessons as T).select.LessonMedia = {
            select: {
              ...SELECT_MEDIA_PUBLIC,
              lessonMediaId: true,
            },
          };
          if (!allStates) {
            type TT = Prisma.Lesson$LessonMediaArgs<DefaultArgs>;
            (
              (include.Units.select.Lessons as T).select.LessonMedia as TT
            ).where = { purpose: 'lesson_material', state: 'uploaded' };
          }
        }
      }
      if (!allQuizzes && options.getUnitsQuizzes) {
        include.Units.select.Quizzes = {
          where: { lessonId: null },
          select: SELECT_QUIZ_PUBLIC,
          orderBy: { order: 'asc' },
        };
        if (!allStates) {
          include.Units.select.Quizzes.where.state = 'available';
        }
      }
      if (options.getUnitsMedia) {
        include.Units.select.UnitMedia = {
          select: {
            ...SELECT_MEDIA_PUBLIC,
            unitMediaId: true,
          },
        };
        if (!allStates) {
          include.Units.select.UnitMedia.where = {
            purpose: 'unit_material',
            state: 'uploaded',
          };
        }
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
        orderBy: { order: 'asc' },
      };
      if (!allStates) {
        include.Lessons.where = { state: 'available' };
      }
      if (!allQuizzes && options.getLessonsQuizzes) {
        include.Lessons.select.Quizzes = {
          select: SELECT_QUIZ_PUBLIC,
          orderBy: { order: 'asc' },
        };
        if (!allStates) {
          include.Lessons.select.Quizzes.where = {
            state: 'available',
          };
        }
      }

      if (options.getLessonsMedia) {
        include.Lessons.select.LessonMedia = {
          select: {
            ...SELECT_MEDIA_PUBLIC,
            lessonMediaId: true,
          },
        };
        if (!allStates) {
          include.Lessons.select.LessonMedia.where = {
            purpose: 'lesson_material',
            state: 'uploaded',
          };
        }
      }
    }
    if (allQuizzes) {
      include.Quizzes = {
        select: SELECT_QUIZ_PUBLIC,
        orderBy: { order: 'asc' },
      };
      if (!allStates) {
        include.Quizzes.where.state = 'available';
      }
    } else if (options.getCourseQuizzes) {
      include.Quizzes = {
        where: { unitId: null, lessonId: null },
        select: SELECT_QUIZ_PUBLIC,
        orderBy: { order: 'asc' },
      };
      if (!allStates) {
        include.Quizzes.where.state = 'available';
      }
    }
    if (options.getCourseMedia) {
      include.CourseMedia = {
        select: {
          ...SELECT_MEDIA_PUBLIC,
          courseMediaId: true,
        },
      };
      if (!allStates) {
        include.CourseMedia.where = {
          purpose: 'course_material',
          state: 'uploaded',
        };
      }
    }
    const course = await this.prisma.course.findFirst({
      where: { courseId: id },
      include: include,
    });
    if (allQuizzes) {
      const unitsQuizzes: { [unitId: number]: TSelectQuizPublic[] } = {};
      const lessonsQuizzes: { [lessonId: number]: TSelectQuizPublic[] } = {};
      course.Quizzes = course.Quizzes.filter((q) => {
        if (q.unitId) {
          if (q.lessonId) {
            if (lessonsQuizzes[q.lessonId]) {
              lessonsQuizzes[q.lessonId].push(q);
            } else {
              lessonsQuizzes[q.lessonId] = [q];
            }
          } else {
            if (unitsQuizzes[q.unitId]) {
              unitsQuizzes[q.unitId].push(q);
            } else {
              unitsQuizzes[q.unitId] = [q];
            }
          }
          return false;
        }
        return true;
      });
      (
        course.Units as (Unit & {
          Quizzes: TSelectQuizPublic[];
          Lessons: (Lesson & { Quizzes: TSelectQuizPublic[] })[];
        })[]
      ).map((u) => {
        u.Quizzes = unitsQuizzes[u.unitId];
        delete unitsQuizzes[u.unitId];
        u.Lessons.map((l) => {
          l.Quizzes = lessonsQuizzes[l.lessonId];
          delete lessonsQuizzes[l.lessonId];
        });
      });
    }
    return course;
  }

  async authInstructorHard({
    courseId,
    userId,
  }: {
    userId: number;
    courseId: number;
  }) {
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
    if (!course.Instructors[0]) {
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
    state?: 'available' | 'calculated_grades';
  }) {
    const targetState = getStatesForCalculatingGrades(inputs.state);
    if (inputs.auto) {
      const units = await this.prisma.unit.findMany({
        where: {
          courseId: inputs.courseId,
          state: inputs.allStates
            ? { in: ['available', 'calculated_grades', 'created'] }
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
      const sumQuiz = await tx.quizMetaData.aggregate({
        where: {
          Quiz: {
            courseId: inputs.courseId,
            unitId: null,
            lessonId: null,
            state: { in: targetState },
          },
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
    });

    return result;
  }
}

const TEACHERS_POSITIONS = ['OWNER', 'TEACHER'];
