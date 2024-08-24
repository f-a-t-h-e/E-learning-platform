import { ApiProperty } from '@nestjs/swagger';
import { QuizSubmission } from '@prisma/client';
import { QuizAnswerEntity } from './quiz-answer.entity';

export class QuizSubmissionEntity implements QuizSubmission {
  @ApiProperty({
    description: 'Unique identifier for the quiz submission',
    example: 1,
  })
  quizSubmissionId: number;

  @ApiProperty({
    description: 'Grades obtained by the student in the quiz',
    example: 85,
    nullable: true,
  })
  grade: number | null;

  @ApiProperty({
    description: 'The ID of the course associated with the quiz submission',
    type: Number,
    example: 101,
    minimum: 1,
  })
  courseId: number;

  @ApiProperty({
    description: 'Unique identifier for the associated quiz',
    example: 101,
  })
  quizId: number;

  @ApiProperty({
    description: 'Unique identifier for the student who took the quiz',
    example: 202,
  })
  studentId: number;

  @ApiProperty({
    description: 'The number of attempts made for the quiz submission',
    example: 3,
  })
  attempts: number;

  @ApiProperty({
    description: 'The date and time when the submission was made',
    example: '2024-08-23T15:00:00Z',
  })
  submittedAt: Date;

  @ApiProperty({
    description: 'The date and time when the submission was reviewed',
    example: '2024-08-24T10:00:00Z',
  })
  reviewedAt: Date;

  @ApiProperty({
    description: 'Timestamp when the quiz submission was created',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The answers submitted by the student for this submission',
    nullable: true,
  })
  Answers?: QuizAnswerEntity[];
}
