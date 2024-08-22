import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  Min,
  IsOptional,
  IsArray,
  ValidateNested,
  Max,
  IsInt,
} from 'class-validator';
import { SubCreateQuizQuestionDto } from './sub-create-quiz-question.dto';

export class CreateQuizDto {
  @ApiProperty({
    description: 'The order of the quiz in the sequence',
    type: Number,
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ description: 'Title of the quiz', example: 'Final Exam' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'ID of the associated course',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  courseId: number;

  @ApiProperty({
    description: 'ID of the associated unit',
    example: 1,
    nullable: true,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  unitId?: number | null;

  @ApiProperty({
    description: 'ID of the associated lesson',
    example: 1,
    nullable: true,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  lessonId?: number | null;

  @ApiProperty({
    description: 'Full grade of the quiz',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  fullGrade: number;
  
  @ApiProperty({
    description: 'Pass grade of the quiz',
    example: 6,
    minimum: 0,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  passGrade?: number|null;

  @ApiProperty({
    description: 'Date when the quiz starts',
    example: '2024-09-23T00:00:00Z',
  })
  @IsDateString()
  startsAt: Date;

  @ApiProperty({
    description: 'Date when the quiz ends',
    example: '2024-09-25T23:59:59Z',
    nullable: true,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endsAt?: Date | null;

  @ApiProperty({
    description: 'Date for late submission',
    example: '2024-09-27T23:59:59Z',
    nullable: true,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  lateSubmissionDate?: Date | null;

  @ApiProperty({
    description: `How many times students can submit a solution, \`null\` for infinite submissions (note that it won't be inserted as infinite but will allow infinite re-submit)`,
    examples: [1, 3, null],
    nullable: true,
    minimum: 1,
    maximum: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  attemptsAllowed?: number | null;

  @ApiProperty({
    type: [SubCreateQuizQuestionDto],
    description: 'Array of questions for the quiz',
    example: [
      {
        questionText: 'Which country has less population?',
        questionType: $Enums.QuestionType.multiple_choice,
        order: 1,
        fullGrade: 10,
        passGrade: 5,
        Options: [
          { grade: 10, optionText: 'Afghanistan', quizeQuestionOptionId: 1 },
          { grade: 0, optionText: 'Pakistan', quizeQuestionOptionId: 2 },
        ],
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubCreateQuizQuestionDto)
  Questions?: SubCreateQuizQuestionDto[];
}
