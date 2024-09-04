import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MediaState, MediaType } from '@prisma/client';
import { PrismaService } from 'common/prisma/prisma.service';
import path from 'path';
import { MediaPurposeEnum, MediaPurposeTargetEnum } from './media-purpose.enum';
import { CombinedMediaEntity } from './entities/combined-media.entity';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: {
    profileId: number;
    type: MediaType;
    courseId?: number;
    unitId?: number;
    lessonId?: number;
    url?: string;
    questionId?: number;
    extension: string;
    purpose: keyof MediaPurposeEnum;
    bytes?: number;
  }) {
    const media = await this.prisma[
      MediaPurposeTargetEnum[data.purpose].table[0]
      // @ts-expect-error nevermind it, just make sure you have the correct inputs and mappings
    ].create({
      data: {
        type: data.type,
        url: data.url || 'id',
        [MediaPurposeTargetEnum[data.purpose].targetId]:
          data[MediaPurposeTargetEnum[data.purpose].targetId]!,
        bytes: data.bytes || 0,
        extension: data.extension,
        state: 'uploading',
        purpose: data.purpose,
        ...(data.questionId ? { questionId: data.questionId } : {}),

        userId: data.profileId,
      },
    });
    media.id = media[MediaPurposeTargetEnum[data.purpose].pk];
    return media as CombinedMediaEntity & { id: number };
  }
  async findOne(id: number, purpose: keyof MediaPurposeEnum) {
    return (await this.prisma[
      MediaPurposeTargetEnum[purpose].table[0]
      // @ts-expect-error nevermind it, just make sure you have the correct inputs and mappings
    ].findFirst({
      where: { [MediaPurposeTargetEnum[purpose].pk]: id },
    })) as CombinedMediaEntity;
  }

  getType(mime: string): MediaType | null {
    for (const t of typesMap) {
      if (t.test.test(mime)) {
        return t.type;
      }
    }
    return null;
  }

  async completeMedia(
    id: number,
    userId: number,
    purpose: keyof MediaPurposeEnum,
  ) {
    type K =
      (typeof MediaPurposeTargetEnum)[keyof MediaPurposeEnum]['targetId'];
    const media = (await this.prisma[
      MediaPurposeTargetEnum[purpose].table[0]
      // @ts-expect-error nevermind it, just make sure you have the correct inputs and mappings
    ].findUnique({
      where: { [MediaPurposeTargetEnum[purpose].pk]: id },
      select: {
        userId: true,
        state: true,
        url: true,
        purpose: true,
        extension: true,
        [MediaPurposeTargetEnum[purpose].targetId]: true,
      },
    })) as {
      [k in K]?: number;
    } & {
      url: string;
      extension: string;
      state: MediaState;
      userId: number;
      purpose: keyof MediaPurposeEnum;
    };
    if (!media) {
      throw new NotFoundException(`No such media exists`);
    }
    if (media.userId !== userId) {
      throw new ForbiddenException(`You have no access to this media`);
    }
    if (media.purpose !== purpose) {
      throw new BadRequestException(`This media has different purpose`);
    }
    media.state = 'uploaded';
    media.url = path.join(
      media.url,
      `${media.userId}_${id}.${media.extension}`,
    );
    // @ts-expect-error nevermind it, just make sure you have the correct inputs and mappings
    await this.prisma[MediaPurposeTargetEnum[purpose].table[0]].updateMany({
      where: { [MediaPurposeTargetEnum[purpose].pk]: id },
      data: {
        state: 'uploaded',
        url: media.url,
      },
    });

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
