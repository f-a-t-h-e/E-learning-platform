import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './modules/courses/courses.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UnitsModule } from './modules/units/units.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { LessonsContentsModule } from './modules/lessons-contents/lessons-contents.module';
import { MediaModule } from './modules/media/media.module';
import { CoursesEnrollmentsModule } from './modules/courses-enrollments/courses-enrollments.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/roles.guard';

@Module({
  imports: [
    AuthModule,
    CoursesModule,
    CoursesEnrollmentsModule,
    PrismaModule,
    UnitsModule,
    LessonsModule,
    LessonsContentsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
