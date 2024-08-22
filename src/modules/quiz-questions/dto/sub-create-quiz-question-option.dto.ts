import { OmitType } from '@nestjs/swagger';
import { CreateQuizQuestionOptionDto } from './create-quiz-question-option.dto';

export class SubCreateQuizQuestionOptionDto extends OmitType(
  CreateQuizQuestionOptionDto,
  ['questionId'] as const,
) {}
