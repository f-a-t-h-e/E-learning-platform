import { SetMetadata } from '@nestjs/common';
import { CourseMediaTarget } from '@prisma/client';

export const MEDIA_TARGET = 'media-target';
export const MediaTargetDecorator = (target: CourseMediaTarget) =>
  SetMetadata(MEDIA_TARGET, target);
