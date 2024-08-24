import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  Min,
  ValidateNested,
  IsArray,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import { SubCreateQuizQuestionOptionDto } from './sub-create-quiz-question-option.dto';

export class CreateQuizQuestionDto {
  @ApiProperty({
    description: 'The order of the question within the quiz',
    type: Number,
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({
    description: 'Text of the quiz question',
    example: 'Which country has less population?',
  })
  @IsNotEmpty()
  @IsString()
  questionText: string;

  @ApiProperty({
    description: 'Type of the question',
    enum: $Enums.QuestionType,
    example: $Enums.QuestionType.multiple_choice,
  })
  @IsEnum($Enums.QuestionType)
  questionType: $Enums.QuestionType;

  @ApiProperty({
    description: 'Full grade of the quiz question',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  fullGrade: number;

  @ApiProperty({
    description: 'Pass grade of the quiz question',
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  passGrade?: number | null;

  @ApiProperty({
    description: 'Correct answer for the quiz question, if applicable',
    example: 'Egypt',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  correctAnswer?: string | null;

  @ApiProperty({
    description: 'ID of the quiz to which this question belongs',
    example: 1,
  })
  @IsInt()
  quizId: number;

  @ApiProperty({
    type: [SubCreateQuizQuestionOptionDto],
    description: 'Array of options for the quiz question',
    example: [
      { grade: 1, optionText: 'Afghanistan', order: 1 },
      { grade: 0, optionText: 'Pakistan', order: 2 },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubCreateQuizQuestionOptionDto)
  Options?: SubCreateQuizQuestionOptionDto[];
}
