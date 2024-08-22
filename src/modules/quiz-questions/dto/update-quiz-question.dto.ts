import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuizQuestionDto } from './create-quiz-question.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateQuizQuestionDto extends PartialType(CreateQuizQuestionDto) {
  @ApiProperty({
    description: 'Unique identifier for the quiz question',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  quizQuestionId: number;
}
