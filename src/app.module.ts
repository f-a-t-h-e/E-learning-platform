import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesGuard } from './modules/auth/guards/roles.guard';

import { CoursesModule } from './modules/courses/courses.module';
import { AuthModule } from './modules/auth/auth.module';
import { UnitsModule } from './modules/units/units.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { LessonsContentsModule } from './modules/lessons-contents/lessons-contents.module';
import { MediaModule } from './modules/media/media.module';
import { CoursesEnrollmentsModule } from './modules/courses-enrollments/courses-enrollments.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { QuizQuestionsModule } from './modules/quiz-questions/quiz-questions.module';
import { QuizSubmissionsModule } from './modules/quiz-submissions/quiz-submissions.module';
import { UserProfileModule } from './modules/user-profile/user-profile.module';

import { GlobalModulesWrapper } from './global-modules.wrapper';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GlobalModulesWrapper,
    AuthModule,
    CoursesModule,
    CoursesEnrollmentsModule,
    UnitsModule,
    LessonsModule,
    LessonsContentsModule,
    QuizzesModule,
    QuizQuestionsModule,
    QuizSubmissionsModule,
    MediaModule,
    UserProfileModule,
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
