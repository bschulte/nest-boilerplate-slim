import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

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
  ],
})
export class AppModule {}
