import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  await app.listen(port);
}
bootstrap();
