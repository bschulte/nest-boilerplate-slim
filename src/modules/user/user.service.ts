import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../bases/base.service';
import { User } from './user.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }
}
