import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}
