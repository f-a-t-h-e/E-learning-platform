import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
  Min,
  Max,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateQuizQuestionDto } from 'src/modules/quiz-questions/dto/create-quiz-question.dto';

export class CreateQuizDto {
  @ApiProperty({
    description: 'The order of the quiz in the sequence',
    type: Number,
    example: 1,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(1, { message: 'Order must be at least 1' })
  order: number;

  @ApiProperty({ description: 'Title of the quiz', example: 'Final Exam' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'ID of the associated course', example: 101 })
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @ApiProperty({
    description: 'ID of the associated unit',
    example: 202,
    nullable: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  unitId?: number | null;

  @ApiProperty({
    description: 'ID of the associated lesson',
    example: 303,
    nullable: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  lessonId?: number | null;

  @ApiProperty({ description: 'Full mark of the quiz', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  fullMark: number;

  @ApiProperty({ description: 'Pass mark of the quiz', example: 60 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  passMark: number;

  @ApiProperty({
    description: 'Date when the quiz starts',
    example: '2024-09-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  startsAt: Date;

  @ApiProperty({
    description: 'Date when the quiz ends',
    example: '2024-09-10T23:59:59Z',
    nullable: true,
  })
  @IsNotEmpty()
  @IsDate()
  @IsOptional()
  endsAt?: Date | null;

  @ApiProperty({
    description: 'Date for late submission',
    example: '2024-09-12T23:59:59Z',
    nullable: true,
  })
  @IsNotEmpty()
  @IsDate()
  @IsOptional()
  lateSubmissionDate?: Date | null;

  @ApiProperty({
    type: [CreateQuizQuestionDto],
    description: 'Array of questions for the quiz',
    example: [
      {
        questionText: 'Which country has less population?',
        questionType: $Enums.QuestionType.multiple_choice,
        fullMark: 10,
        passMark: 5,
        Options: [
          { mark: 1, optionText: 'Afghanistan', questionId: 1, id: 0 },
          { mark: 0, optionText: 'Pakistan', questionId: 1, id: 1 },
        ],
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionDto)
  Questions?: CreateQuizQuestionDto[];
}
