import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { QuizzesRepository } from './repositories/quizzes.repository';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesRepository, QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
