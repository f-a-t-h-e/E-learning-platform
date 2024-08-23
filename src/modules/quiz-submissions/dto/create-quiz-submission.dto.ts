import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { CreateQuizAnswerDto } from './create-quiz-answer.dto';
import { Type } from 'class-transformer';

export class CreateQuizSubmissionDto {
  @ApiProperty({
    description: 'Unique identifier for the associated quiz',
    example: 101,
  })
  @IsInt()
  quizId: number;

  @ApiProperty({
    description: 'Array of answers provided for the quiz questions',
    type: [CreateQuizAnswerDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateQuizAnswerDto)
  Answers?: CreateQuizAnswerDto[];
}
