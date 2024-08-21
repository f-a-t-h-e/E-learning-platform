import { Module } from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

import { UnitsModule } from '../units/units.module';

@Module({
  imports: [UnitsModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
