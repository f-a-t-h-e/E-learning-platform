import { NestFactory } from '@nestjs/core';
import { AnalyticsServiceModule } from './analytics-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsServiceModule);
  await app.listen(3000);
}
bootstrap();
