import 'source-map-support/register';

import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { CrudConfigService } from '@nestjsx/crud';

// Configure the CRUD service global options
// https://github.com/nestjsx/crud/wiki/Controllers#global-options
CrudConfigService.load({
  query: {
    limit: 25,
    maxLimit: 100,
    cache: 2000,
  },
  auth: {
    property: 'user',
  },
});

import { ConfigService } from '@nestjs/config';
import { Logger } from './modules/logger/logger';
import { AuthUserInterceptor } from './interceptors/auth-user.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Main');

  const configService = app.select(AppModule).get(ConfigService);
  if (configService.get<string>('NODE_ENV') === 'development') {
    const options = new DocumentBuilder()
      .setTitle('Nest Boilerplate Slim')
      .setDescription('A slim boilerplate for NestJS')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('docs', app, document);
  }

  const port = process.env.PORT || 3333;
  logger.debug(`Listening on port: ${port}`);

  // Security
  app.use(helmet());
  app.enableCors();

  app.enable('trust proxy');

  // Set global validation to happen on all request bodies
  app.useGlobalPipes(new ValidationPipe());
  // Set global interceptor
  app.useGlobalInterceptors(new AuthUserInterceptor());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  await app.listen(port);
}
bootstrap();
