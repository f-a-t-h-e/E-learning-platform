import { ApiProperty } from '@nestjs/swagger';
import { $Enums, QuizMedia } from '@prisma/client';
import { MediaEntity } from './media.entity';

export class QuizMediaEntity extends MediaEntity implements QuizMedia {
  @ApiProperty({
    description: 'Unique identifier for the media',
    example: 1,
  })
  quizMediaId: number;

  @ApiProperty({
    description: 'Purpose of the media (e.g., quiz_banner, quiz_material)',
    example: 'quiz_material',
    enum: $Enums.QuizMediaPurpose,
  })
  purpose: $Enums.QuizMediaPurpose;

  @ApiProperty({
    description: 'ID of the associated quiz',
    example: 1,
  })
  quizId: number;
}
