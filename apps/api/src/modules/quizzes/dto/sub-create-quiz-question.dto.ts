import { OmitType } from '@nestjs/swagger';
import { CreateQuizQuestionDto } from '../../quiz-questions/dto/create-quiz-question.dto';

export class SubCreateQuizQuestionDto extends OmitType(CreateQuizQuestionDto, [
  'quizId',
] as const) {}
