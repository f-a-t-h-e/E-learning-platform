import { Module } from '@nestjs/common';
import { QuizSubmissionsService } from './quiz-submissions.service';
import { QuizSubmissionsController } from './quiz-submissions.controller';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [CoursesModule],
  controllers: [QuizSubmissionsController],
  providers: [QuizSubmissionsService],
})
export class QuizSubmissionsModule {}
