import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { FileValidationInterceptor } from '../../common/interceptors/file-validation.interceptor';
import { LessonsModule } from '../lessons/lessons.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [LessonsModule, CoursesModule],
  controllers: [MediaController],
  providers: [MediaService, FileValidationInterceptor],
})
export class MediaModule {}
