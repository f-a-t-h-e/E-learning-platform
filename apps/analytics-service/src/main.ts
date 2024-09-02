import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AnalyticsServiceModule } from './analytics-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AnalyticsServiceModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env['REDIS_HOST']!,
        port: +process.env['REDIS_PORT']!,
      },
    },
  );
  await app.listen();
}
bootstrap();
