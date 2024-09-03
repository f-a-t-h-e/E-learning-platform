import { ApiProperty } from '@nestjs/swagger';
import { $Enums, LessonMedia } from '@prisma/client';
import { MediaEntity } from './media.entity';

export class LessonMediaEntity extends MediaEntity implements LessonMedia {
  @ApiProperty({
    description: 'Unique identifier for the media',
    example: 1,
  })
  lessonMediaId: number;

  @ApiProperty({
    description: 'Purpose of the media (e.g., lesson_banner, lesson_material)',
    example: 'lesson_material',
    enum: $Enums.LessonMediaPurpose,
  })
  purpose: $Enums.LessonMediaPurpose;

  @ApiProperty({
    description: 'ID of the associated lesson',
    example: 1,
  })
  lessonId: number;
}
