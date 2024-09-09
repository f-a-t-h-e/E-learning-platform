import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  // Configure the api docs
  const config = new DocumentBuilder()
    .setTitle('E-Learning Platform Chat')
    .setDescription('The E-Learning Platform Chat API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.CHAT_PORT || 3001;
  await app.listen(port, () => {
    console.log(`chat started at port ${port} localhost:${port}`);
  });
}
bootstrap();
