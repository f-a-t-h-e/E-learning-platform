import { forwardRef, Module } from '@nestjs/common';

import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';

import { CoursesModule } from '../courses/courses.module';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [forwardRef(() => CoursesModule), forwardRef(() => LessonsModule)],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
