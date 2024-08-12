import { Injectable } from '@nestjs/common';

// import * as fileType from "file-type"

import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: {
    userId: number;
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
        userId: data.userId,
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

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
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
