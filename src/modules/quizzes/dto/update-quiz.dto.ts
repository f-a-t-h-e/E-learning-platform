import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuizDto } from './create-quiz.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateQuizQuestionDto } from 'src/modules/quiz-questions/dto/update-quiz-question.dto';
import { CreateQuizQuestionDto } from 'src/modules/quiz-questions/dto/create-quiz-question.dto';

export class UpdateQuizDto extends PartialType(CreateQuizDto) {
  @ApiProperty({
    type: [{ ...UpdateQuizQuestionDto, ...CreateQuizQuestionDto }],
    description: 'Array of questions for the quiz',
    example: [
      {
        questionText: 'Which country has less population?',
        questionType: 'MULTIPLE_CHOICE',
        fullGrade: 10,
        passGrade: 5,
        options: [
          { grade: 1, optionText: 'Afghanistan', questionId: 1, id: 0 },
          { grade: 0, optionText: 'Pakistan', questionId: 1, id: 1 },
        ],
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ({ ...UpdateQuizQuestionDto, ...CreateQuizQuestionDto }))
  Questions?: (UpdateQuizQuestionDto & CreateQuizQuestionDto)[];
}
