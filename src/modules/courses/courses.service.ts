import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}
  async create(createCourseDto: CreateCourseDto, userId) {
    const course = await this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        CourseInstructors: {
          create: {
            position: 'OWNER',
            instructorId: userId,
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

  async findOne(id: number) {
    const course = await this.prisma.course.findFirst({ where: { id: id } });
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto, userId: number) {
    const course = await this.prisma.course.update({
      where: {
        id: id,
        CourseInstructors: {
          some: {
            instructorId: userId,
          },
        },
      },
      data: {
        ...updateCourseDto,
      },
    });
    return course;
  }

  async remove(id: number, userId: number) {
    const course = await this.prisma.course.delete({
      where: {
        id: id,
        CourseInstructors: {
          some: {
            instructorId: userId,
          },
        },
      },
    });
    return course;
  }

  async isUserATeacherAtCourse(userId: number, courseId: number) {
    const instructore = await this.prisma.courseInstructor.findFirst({
      where: {
        courseId: courseId,
        instructorId: userId,
      },
      select: {
        position: true,
      }
    });

    return TEACHERS_POSITIONS.includes(instructore.position) && instructore;
  }
}

const TEACHERS_POSITIONS = ['OWNER', 'TEACHER'];
