import { Module } from '@nestjs/common';

import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';

import { CoursesModule } from '../courses/courses.module';
import { QuizzesModule } from '../quizzes/quizzes.module';

@Module({
  imports: [CoursesModule, QuizzesModule],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
