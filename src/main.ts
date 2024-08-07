import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  // Configure the api docs
  const config = new DocumentBuilder()
    .setTitle('E-Learning Platform')
    .setDescription('The E-Learning Platform API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server
  const port = 5555;
  await app.listen(port);
  console.log(`PORT : ${port} http://localhost:${port}`);
  
}
bootstrap();
