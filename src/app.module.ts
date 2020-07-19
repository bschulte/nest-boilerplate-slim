import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as morgan from 'morgan';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { Logger } from './modules/logger/logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data.db',
      entities: ['dist/modules/**/*.entity{.ts,.js}'],
      synchronize: true,
      subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
    }),
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
  }
}
