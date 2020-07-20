import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { Logger } from './modules/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  const options = new DocumentBuilder()
    .setTitle('Nest Boilerplate Slim')
    .setDescription('A slim boilerplate for NestJS')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3333;
  logger.debug(`Listening on port: ${port}`);

  // Security
  app.use(helmet());
  app.use(csurf());
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  await app.listen(port);
}
bootstrap();
