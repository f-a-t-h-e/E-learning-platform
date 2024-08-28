import { Module } from '@nestjs/common';
import { QuizQuestionsService } from './quiz-questions.service';
import { QuizQuestionsController } from './quiz-questions.controller';

@Module({
  controllers: [QuizQuestionsController],
  providers: [QuizQuestionsService],
})
export class QuizQuestionsModule {}
