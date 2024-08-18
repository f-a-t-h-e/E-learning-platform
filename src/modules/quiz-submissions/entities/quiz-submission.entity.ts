import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsDate, IsNumber } from 'class-validator';
import { QuizSubmission } from '@prisma/client';
import { QuizAnswerEntity } from './quiz-answer.entity';

export class QuizSubmissionEntity implements QuizSubmission {
  @ApiProperty({
    description: 'Unique identifier for the quiz submission',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Marks obtained by the student in the quiz',
    example: 85,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  marks: number | null;

  @ApiProperty({
    description: 'Unique identifier for the associated quiz',
    example: 101,
  })
  @IsInt()
  quizId: number;

  @ApiProperty({
    description: 'Unique identifier for the student who took the quiz',
    example: 202,
  })
  @IsInt()
  studentId: number;

  @ApiProperty({
    description: 'Timestamp when the quiz submission was created',
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The answers submitted by the student for this submission',
    nullable: true,
  })
  Answers?: QuizAnswerEntity[];
}