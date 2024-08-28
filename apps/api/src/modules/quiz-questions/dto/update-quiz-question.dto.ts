import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuizQuestionDto } from './create-quiz-question.dto';
import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubUpdateQuizQuestionOptionDto } from './sub-update-quiz-question-option.dto';

export class UpdateQuizQuestionDto extends PartialType(CreateQuizQuestionDto) {
  @ApiProperty({
    description: 'Unique identifier for the quiz question',
    example: 1,
  })
  @IsInt()
  quizQuestionId: number;

  @ApiProperty({
    type: [SubUpdateQuizQuestionOptionDto],
    description: 'Array of options for the quiz question',
    example: [
      {
        grade: 1,
        optionText: 'Afghanistan',
        quizeQuestionOptionId: 3,
        order: 2,
      },
      { grade: 0, optionText: 'Pakistan', quizeQuestionOptionId: 4, order: 1 },
      { grade: 0, optionText: 'Indonesia', order: 3 },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubUpdateQuizQuestionOptionDto)
  Options?: SubUpdateQuizQuestionOptionDto[];
}
