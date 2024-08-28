import { ApiProperty } from '@nestjs/swagger';
import { QuizMetaData, QuizReviewType, QuizType } from '@prisma/client';

export class QuizMetaDataEntity implements QuizMetaData {
  @ApiProperty({
    description: 'The unique identifier of the quiz',
    example: 1,
  })
  quizId: number;

  @ApiProperty({
    description: 'The full grade achievable for the quiz',
    example: 100,
  })
  fullGrade: number;

  @ApiProperty({
    description: 'The minimum grade required to pass the quiz',
    example: 60,
    nullable: true,
  })
  passGrade: number | null;

  @ApiProperty({
    description: `The number of attempts allowed for the quiz, \`null\` for infinite`,
    example: 3,
    nullable: true,
  })
  attemptsAllowed: number | null;

  @ApiProperty({
    description: 'The type of review allowed for the quiz',
    enum: QuizReviewType,
    example: QuizReviewType.automatic,
  })
  reviewType: QuizReviewType;

  @ApiProperty({
    description: 'The type of quiz',
    enum: QuizType,
    example: QuizType.sequential,
  })
  type: QuizType;

  @ApiProperty({
    description: 'The date and time when the quiz starts',
    example: '2024-08-24T10:00:00Z',
  })
  startsAt: Date;

  @ApiProperty({
    description: `The date and time when the quiz ends, \`null\` for unended`,
    example: '2024-08-25T10:00:00Z',
    nullable: true,
  })
  endsAt: Date | null;

  @ApiProperty({
    description: `The date and time by which late submissions are accepted, this is used in case you want to allow the counter to start counting from the time the student starts the quiz or from the begining of the startsAt`,
    example: '2024-08-26T10:00:00Z',
    nullable: true,
  })
  lateSubmissionDate: Date | null;
}
