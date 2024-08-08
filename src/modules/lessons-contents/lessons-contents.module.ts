import { Module } from '@nestjs/common';
import { LessonsContentsService } from './lessons-contents.service';
import { LessonsContentsController } from './lessons-contents.controller';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [LessonsModule],
  controllers: [LessonsContentsController],
  providers: [LessonsContentsService],
})
export class LessonsContentsModule {}
