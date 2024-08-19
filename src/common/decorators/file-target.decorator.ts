import { SetMetadata } from '@nestjs/common';
import { MediaTarget } from '@prisma/client';

export const MEDIA_TARGET = 'media-target';
export const MediaTargetDecorator = (target: MediaTarget) =>
  SetMetadata(MEDIA_TARGET, target);
