import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { FileValidationInterceptor } from './interceptors/file-validation.interceptor';
import { LessonsModule } from '../lessons/lessons.module';
import { CoursesModule } from '../courses/courses.module';
import { UnitsModule } from '../units/units.module';
import { UserProfileModule } from '../user-profile/user-profile.module';

@Module({
  imports: [UserProfileModule, CoursesModule, UnitsModule, LessonsModule],
  controllers: [MediaController],
  providers: [MediaService, FileValidationInterceptor],
})
export class MediaModule {}
