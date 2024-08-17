import { Module } from '@nestjs/common';
import { CoursesEnrollmentsService } from './courses-enrollments.service';
import { CoursesEnrollmentsController } from './courses-enrollments.controller';

@Module({
  controllers: [CoursesEnrollmentsController],
  providers: [CoursesEnrollmentsService],
})
export class CoursesEnrollmentsModule {}
