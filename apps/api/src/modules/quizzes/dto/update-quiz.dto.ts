import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateQuizDto } from './create-quiz.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubUpdateQuizQuestionDto } from './sub-update-quiz-question.dto';
import { $Enums } from '@prisma/client';

export class UpdateQuizDto extends OmitType(PartialType(CreateQuizDto), [
  'courseId',
]) {
  @ApiProperty({
    type: [SubUpdateQuizQuestionDto],
    description: 'Array of questions for the quiz',
    example: [
      {
        quizQuestionId: 2,
        order: 1,
        questionText: 'Which country has less population?',
        questionType: $Enums.QuestionType.multiple_choice,
        fullGrade: 10,
        passGrade: 5,
        Options: [
          {
            grade: 10,
            optionText: 'Afghanistan',
            order: 3,
            questionId: 1,
            quizeQuestionOptionId: 1,
          },
          { grade: 0, optionText: 'Egypt', order: 1, questionId: 1 },
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
