import { Injectable } from '@nestjs/common';
import { CreateLessonsContentDto } from './dto/create-lessons-content.dto';
import { UpdateLessonsContentDto } from './dto/update-lessons-content.dto';
import { PrismaService } from 'common/prisma/prisma.service';
import { $Enums } from '@prisma/client';

@Injectable()
export class LessonsContentsService {
  constructor(private prisma: PrismaService) {}
  async create(
    createLessonsContentDto: CreateLessonsContentDto,
    contentType: $Enums.ContentType,
  ) {
    const content = await this.prisma.lessonContent.create({
      data: {
        lessonId: createLessonsContentDto.lessonId,
        content: createLessonsContentDto.content,
        contentType: contentType,
      },
    });
    return content;
  }

  async findAll(unitId: number) {
    const contents = await this.prisma.lesson.findMany({
      where: {
        unitId: unitId,
      },
      select: {
        LessonContent: true,
        lessonId: true,
      },
    });
    return contents.map((value) => value.LessonContent);
  }

  async findOne(id: number) {
    const content = await this.prisma.lessonContent.findFirst({
      where: { lessonId: id },
    });
    return content;
  }

  async update(
    id: number,
    updateLessonsContentDto: UpdateLessonsContentDto & {
      contentType?: $Enums.ContentType;
    },
  ) {
    const content = await this.prisma.lessonContent.update({
      where: {
        lessonId: id,
      },
      data: {
        ...updateLessonsContentDto,
      },
    });

    return content;
  }

  async remove(id: number) {
    const content = await this.prisma.lessonContent.delete({
      where: {
        lessonId: id,
      },
    });

    return content;
  }
}
