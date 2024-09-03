import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateQuizQuestionDto } from '../../quiz-questions/dto/create-quiz-question.dto';
import { SubUpdateQuizQuestionOptionDto } from '../../quiz-questions/dto/sub-update-quiz-question-option.dto';

export class SubUpdateQuizQuestionDto extends OmitType(CreateQuizQuestionDto, [
  'quizId',
]) {
  @ApiProperty({
    description: `Unique identifier for the quiz question. If you don't send it, it means that this is a new question`,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
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
