import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../bases/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;
}
