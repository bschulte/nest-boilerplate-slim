import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';
import { BaseEntity } from '../bases/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  @ApiProperty({ name: 'email', description: 'Email address for the user' })
  email: string;

  @Column()
  @MinLength(10)
  @ApiProperty({ name: 'password', description: 'Password for logging in' })
  password: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetTokenExpires: Date;

  @Column({ default: false })
  isAdmin: boolean;
}
