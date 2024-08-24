import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { SubCreateQuizQuestionOptionDto } from './sub-create-quiz-question-option.dto';

export class SubUpdateQuizQuestionOptionDto extends SubCreateQuizQuestionOptionDto {
  @ApiProperty({
    description:
      'The ID of the option that you want to update, empty/undefined for a new option insert',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quizeQuestionOptionId?: number;
}
