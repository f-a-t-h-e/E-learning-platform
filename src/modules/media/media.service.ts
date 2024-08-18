import { Injectable } from '@nestjs/common';

import { MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: {
    profileId: number;
    type: MediaType;
    courseId?: number;
    url?: string;
    extension: string;
    lessonId?: number;
  }) {
    const media = await this.prisma.media.create({
      data: {
        type: data.type,
        url: data.url || 'id',
        courseId: data.courseId,
        profileId: data.profileId,
        bytes: 0,
        extension: data.extension,
        state: 'UPLOADING',
        lessonId: data.lessonId,
      },
    });
    return media;
  }

  findAll() {
    return `This action returns all media`;
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
