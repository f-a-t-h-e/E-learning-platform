import { QuizQuestionOption } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class QuizQuestionOptionEntity implements QuizQuestionOption {
  @ApiProperty({
    description: 'Unique identifier (for each question) for the option',
    example: 1,
    minimum: 1,
  })
  quizeQuestionOptionId: number;

  @ApiProperty({
    description: 'The order of the option within the question',
    type: Number,
    example: 1,
    minimum: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Grade awarded for selecting this option',
    example: 1,
    minimum: 1,
  })
  grade: number;

  @ApiProperty({
    description: 'Text of the option',
    example: 'Paris',
  })
  optionText: string;

  @ApiProperty({
    description: 'ID of the question to which this option belongs',
    example: 1,
    minimum: 1,
  })
  questionId: number;
}
