import { SetMetadata } from '@nestjs/common';
import { MediaPurposeEnum } from '../media-purpose.enum';

export const MEDIA_PURPOSE = 'media-purpose';
export const MediaPurposeDecorator = (purpose: keyof MediaPurposeEnum) =>
  SetMetadata(MEDIA_PURPOSE, purpose);
