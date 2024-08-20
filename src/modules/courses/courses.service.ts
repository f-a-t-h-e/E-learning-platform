import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Course, Prisma } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}
  async create(createCourseDto: CreateCourseDto, userId) {
    const course = await this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        quizzesMark: 0,
        state: "created",
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
          select: { instructorId: true },
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
}

const TEACHERS_POSITIONS = ['OWNER', 'TEACHER'];
