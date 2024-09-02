import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CourseMediaTarget, MediaType } from '@prisma/client';
import { PrismaService } from '../../../../../common/prisma/prisma.service';
import path from 'path';
import { CoursesService } from '../courses/courses.service';
import { UnitsService } from '../units/units.service';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coursesService: CoursesService,
    private readonly unitsService: UnitsService,
    private readonly lessonsService: LessonsService,
  ) {}
  async create(data: {
    profileId: number;
    type: MediaType;
    courseId?: number;
    unitId?: number;
    lessonId?: number;
    url?: string;
    extension: string;
    target: CourseMediaTarget;
    bytes?: number;
  }) {
    const media = await this.prisma.courseMedia.create({
      data: {
        type: data.type,
        url: data.url || 'id',
        courseId: data.courseId,
        unitId: data.unitId,
        lessonId: data.lessonId,
        userId: data.profileId,
        bytes: data.bytes || 0,
        extension: data.extension,
        state: 'uploading',
        target: data.target,
      },
    });
    return media;
  }
  async findOne(id: number) {
    return await this.prisma.courseMedia.findFirst({
      where: { courseMediaId: id },
    });
  }

  getType(mime: string): MediaType | null {
    for (const t of typesMap) {
      if (t.test.test(mime)) {
        return t.type;
      }
    }
    return null;
  }

  async completeMedia(id: number, userId: number) {
    const media = await this.prisma.courseMedia.findUnique({
      where: { courseMediaId: id },
    });
    if (!media) {
      throw new NotFoundException(`No such media exists`);
    }
    if (media.userId !== userId) {
      throw new ForbiddenException(`You have no access to this media`);
    }
    media.state = 'uploaded';
    media.url = path.join(
      media.url,
      `${media.userId}_${media.courseMediaId}.${media.extension}`,
    );
    await this.prisma.courseMedia.updateMany({
      where: { courseMediaId: id },
      data: {
        state: 'uploaded',
        url: media.url,
      },
    });
    switch (media.target) {
      // case 'PROFILE_BANNER':
      //   await this.userProfileService.updateBanner(userId, media.url);
      //   break;
      // case 'PROFILE_PICTURE':
      //   await this.userProfileService.updateAvatar(userId, media.url);
      //   break;
      case 'course_banner':
        await this.coursesService.updateBanner(media.courseId, media.url);
        break;
      case 'unit_banner':
        await this.unitsService.updateBanner(media.unitId, media.url);
        break;
      case 'lesson_banner':
        await this.lessonsService.updateBanner(media.lessonId, media.url);
        break;
      default:
        break;
    }

    return media;
  }
}

const typesMap = [
  {
    test: /^image\//,
    type: MediaType.image,
  },
  {
    test: /^video\//,
    type: MediaType.video,
  },
  {
    test: /^audio\//,
    type: MediaType.audio,
  },
  {
    test: /^(application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/,
    type: MediaType.document,
  },
];
