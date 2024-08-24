import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateQuizDto } from './create-quiz.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubUpdateQuizQuestionDto } from './sub-update-quiz-question.dto';

export class UpdateQuizDto extends OmitType(PartialType(CreateQuizDto), [
  'courseId',
]) {
  @ApiProperty({
    type: [SubUpdateQuizQuestionDto],
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
  @Type(() => SubUpdateQuizQuestionDto)
  Questions?: SubUpdateQuizQuestionDto[];
}
