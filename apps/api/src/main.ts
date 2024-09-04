import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import setup from './configure';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Setup configs
  await setup(app);

  // Start the server
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`PORT : ${port} http://localhost:${port}`);
}
bootstrap();
