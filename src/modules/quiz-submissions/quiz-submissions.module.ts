import { Module } from '@nestjs/common';
import { QuizSubmissionsService } from './quiz-submissions.service';
import { QuizSubmissionsController } from './quiz-submissions.controller';

@Module({
  controllers: [QuizSubmissionsController],
  providers: [QuizSubmissionsService],
})
export class QuizSubmissionsModule {}
