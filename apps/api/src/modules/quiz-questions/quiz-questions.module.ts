import { Module } from '@nestjs/common';
import { QuizQuestionsService } from './quiz-questions.service';
import { QuizQuestionsController } from './quiz-questions.controller';
import { QuizQuestionRepository } from './repositories/quiz-questions.repository';

@Module({
  controllers: [QuizQuestionsController],
  providers: [QuizQuestionRepository, QuizQuestionsService],
})
export class QuizQuestionsModule {}
