import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MediaTarget, MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import path from 'path';
import { CoursesService } from '../courses/courses.service';
import { UnitsService } from '../units/units.service';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userProfileService: UserProfileService,
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
    target: MediaTarget;
    bytes?: number;
  }) {
    const media = await this.prisma.media.create({
      data: {
        type: data.type,
        url: data.url || 'id',
        courseId: data.courseId,
        unitId: data.unitId,
        lessonId: data.lessonId,
        profileId: data.profileId,
        bytes: data.bytes || 0,
        extension: data.extension,
        state: 'UPLOADING',
        target: data.target,
      },
    });
    return media;
  }
  async findOne(id: number) {
    return await this.prisma.media.findFirst({ where: { id: id } });
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
    const media = await this.prisma.media.findUnique({
      where: { id: id },
    });
    if (!media) {
      throw new NotFoundException(`No such media exists`);
    }
    if (media.profileId !== userId) {
      throw new ForbiddenException(`You have no access to this media`);
    }
    media.state = 'UPLOADED';
    media.url = path.join(
      media.url,
      `${media.profileId}_${media.id}.${media.extension}`,
    );
    await this.prisma.media.updateMany({
      where: { id: id },
      data: {
        state: 'UPLOADED',
        url: media.url,
      },
    });
    switch (media.target) {
      case 'PROFILE_BANNER':
        await this.userProfileService.updateBanner(userId, media.url);
        break;
      case 'PROFILE_PICTURE':
        await this.userProfileService.updateAvatar(userId, media.url);
        break;
      case 'COURSE_BANNER':
        await this.coursesService.updateBanner(media.courseId, media.url);
        break;
      case 'UNIT_BANNER':
        await this.unitsService.updateBanner(media.unitId, media.url);
        break;
      case 'LESSON_BANNER':
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
    type: MediaType.IMAGE,
  },
  {
    test: /^video\//,
    type: MediaType.VIDEO,
  },
  {
    test: /^audio\//,
    type: MediaType.AUDIO,
  },
  {
    test: /^(application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/,
    type: MediaType.DOCUMENT,
  },
];
