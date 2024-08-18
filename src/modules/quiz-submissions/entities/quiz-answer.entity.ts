import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';
import { QuizAnswer } from '@prisma/client';

export class QuizAnswerEntity implements QuizAnswer {
  @ApiProperty({
    description: 'Unique identifier for the quiz answer',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'The text of the answer provided by the student',
    example: 'Paris',
  })
  @IsString()
  answer: string;

  @ApiProperty({
    description: 'Marks awarded for the answer',
    example: 5,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  mark: number | null;

  @ApiProperty({
    description: 'Unique identifier for the associated quiz question',
    example: 301,
  })
  @IsInt()
  questionId: number;

  @ApiProperty({
    description:
      'Unique identifier for the quiz submission to which this answer belongs',
    example: 401,
  })
  @IsInt()
  submissionId: number;
}
