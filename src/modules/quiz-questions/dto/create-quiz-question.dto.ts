import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { CreateQuizQuestionOptionDto } from './create-quiz-question-option.dto';
import { Type } from 'class-transformer';

export class CreateQuizQuestionDto {
  @ApiProperty({
    description: 'The order of the question within the quiz',
    type: Number,
    example: 1,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(1, { message: 'Order must be at least 1' })
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
  @IsNotEmpty()
  @IsEnum($Enums.QuestionType)
  questionType: $Enums.QuestionType;

  @ApiProperty({
    description: 'Full mark of the quiz question',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  fullMark: number;

  @ApiProperty({
    description: 'Pass mark of the quiz question',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  passMark: number;

  @ApiProperty({
    description: 'Correct answer for the quiz question, if applicable',
    example: 'Egypt',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  correctAnswer: string | null;

  @ApiProperty({
    description: 'ID of the quiz to which this question belongs',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  quizId: number;

  @ApiProperty({
    type: [CreateQuizQuestionOptionDto],
    description: 'Array of options for the quiz question',
    example: [
      { mark: 1, optionText: 'Afghanistan', questionId: 1, id: 0 },
      { mark: 0, optionText: 'Pakistan', questionId: 1, id: 1 },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionOptionDto)
  Options?: CreateQuizQuestionOptionDto[];
}
