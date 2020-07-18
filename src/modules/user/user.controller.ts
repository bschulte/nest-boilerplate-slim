import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { UserService } from './user.service';
import { User } from './user.entity';

@Crud({
  model: {
    type: User,
  },
})
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
}
