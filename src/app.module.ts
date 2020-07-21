import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as morgan from 'morgan';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { Logger } from './modules/logger/logger';
import { SessionMiddleware } from './middleware/session.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot(),
    EmailModule,
  ],
})
export class AppModule implements NestModule {
  private morganLogger = new Logger('Morgan');

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        morgan('combined', {
          stream: {
            write: str => this.morganLogger.verbose(str.replace(/\n/g, '')),
          },
        }),
      )
      .forRoutes('*');

    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
