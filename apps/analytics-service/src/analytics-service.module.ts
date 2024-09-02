import { Module } from '@nestjs/common';
import { AnalyticsServiceController } from './analytics-service.controller';
import { AnalyticsServiceService } from './analytics-service.service';
import { QuizReviewModule } from './modules/quiz-review/quiz-review.module';
import { PrismaModule } from 'common/prisma/prisma.module';

@Module({
  imports: [QuizReviewModule, PrismaModule],
  controllers: [AnalyticsServiceController],
  providers: [AnalyticsServiceService],
})
export class AnalyticsServiceModule {}
