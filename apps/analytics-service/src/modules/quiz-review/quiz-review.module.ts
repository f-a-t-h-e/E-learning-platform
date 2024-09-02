import { Module } from '@nestjs/common';
import { QuizReviewService } from './quiz-review.service';
import { QuizReviewController } from './quiz-review.controller';

@Module({
  controllers: [QuizReviewController],
  providers: [QuizReviewService],
})
export class QuizReviewModule {}
