import { $Enums, QuizQuestion } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { QuizQuestionOptionEntity } from './quiz-question-option.entity';
import { Type } from 'class-transformer';

export class QuizQuestionEntity implements QuizQuestion {
  @ApiProperty({
    description: 'Unique identifier for the quiz question',
    example: 1,
  })
  quizQuestionId: number;

  @ApiProperty({
    description: 'The order of the question within the quiz',
    type: Number,
    example: 1,
    minimum: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Text of the quiz question',
    example: 'What is the capital of France?',
  })
  questionText: string;

  @ApiProperty({
    description: 'Type of the question',
    enum: $Enums.QuestionType,
    example: $Enums.QuestionType.multiple_choice,
  })
  questionType: $Enums.QuestionType;

  @ApiProperty({
    description: 'Full grade of the quiz question',
    example: 10,
  })
  fullGrade: number;

  @ApiProperty({
    description: 'Pass grade of the quiz question',
    example: 5,
  })
  passGrade: number;

  @ApiProperty({
    description: 'Correct answer for the quiz question, if applicable',
    example: 'Paris',
    nullable: true,
  })
  correctAnswer: string | null;

  @ApiProperty({
    description: 'ID of the quiz to which this question belongs',
    example: 1,
  })
  quizId: number;

  @ApiProperty({
    type: [QuizQuestionOptionEntity],
    description: 'Array of options for the quiz question',
    example: [
      { grade: 1, optionText: 'Afghanistan', questionId: 1, id: 0 },
      { grade: 0, optionText: 'Pakistan', questionId: 1, id: 1 },
    ],
    required: false,
  })
  @Type(() => QuizQuestionOptionEntity)
  Options?: QuizQuestionOptionEntity[];
}
