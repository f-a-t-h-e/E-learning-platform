import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import fn from './modules/media/utils/getFileTypeFromStream';

export default async function setup(app: INestApplication<any>) {
  app.use(cookieParser());
  // Configure the api docs
  const config = new DocumentBuilder()
    .setTitle('E-Learning Platform')
    .setDescription('The E-Learning Platform API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  if (!fn.fileTypeFromStream) {
    await eval(`import('file-type')`).then((module: typeof fn) => {
      fn.fileTypeFromStream = module.fileTypeFromStream;
    });
  }
}
