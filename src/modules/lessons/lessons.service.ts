import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Lesson } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}
  async create(createLessonDto: CreateLessonDto, userId) {
    const lesson = await this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        description: createLessonDto.description,
        addedBy: userId,
        courseId: createLessonDto.courseId,
        unitId: createLessonDto.unitId,
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
      where: { id: id },
      include,
    });
    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto, courseId: number) {
    const lesson = await this.prisma.lesson.update({
      where: {
        id: id,
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
        id: id,
        courseId: courseId,
      },
    });
    return lesson;
  }

  // authorization methods
  async canUserEditLesson(userId: number, lessonId: number) {
    const foundResult = await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        Course: {
          Instructors: {
            some: {
              instructorId: userId,
            },
          },
        },
      },
      select: {
        addedBy: true,
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
        id: lessonId,
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
    return false as false;
  }

  async updateBanner(id: Lesson['id'], url: string) {
    await this.prisma.lesson.updateMany({
      where: {
        id: id,
      },
      data: {
        banner: url,
      },
    });
    // @todo You can do some notification in case you want to get closer to a social media platform
  }
}
