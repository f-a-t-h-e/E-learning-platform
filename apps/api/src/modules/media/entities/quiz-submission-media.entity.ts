import { ApiProperty } from '@nestjs/swagger';
import { $Enums, QuizSubmissionMedia } from '@prisma/client';
import { MediaEntity } from './media.entity';

export class QuizSubmissionMediaEntity
  extends MediaEntity
  implements QuizSubmissionMedia
{
  @ApiProperty({
    description: 'Unique identifier for the media',
    example: 1,
  })
  quizSubmissionMediaId: number;

  @ApiProperty({
    description:
      'Purpose of the media (e.g., full_quiz_answers, single_question_answer)',
    example: 'single_question_answer',
    enum: $Enums.QuizSubmissionMediaPurpose,
  })
  purpose: $Enums.QuizSubmissionMediaPurpose;

  @ApiProperty({
    description: 'ID of the associated quiz submission',
    example: 3,
  })
  quizSubmissionId: number;
}
