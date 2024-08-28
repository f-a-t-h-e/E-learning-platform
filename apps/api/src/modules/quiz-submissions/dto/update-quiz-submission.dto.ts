import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateQuizAnswerDto } from './create-quiz-answer.dto';

export class UpdateQuizSubmissionDto {
  @ApiProperty({
    description: 'Array of answers provided for the quiz questions',
    type: [CreateQuizAnswerDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizAnswerDto)
  Answers: CreateQuizAnswerDto[];
}
