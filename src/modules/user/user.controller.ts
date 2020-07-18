import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['createOneBase', 'getOneBase'],
    createOneBase: {
      decorators: [
        ApiOperation({
          description: 'Register a new user',
        }),
      ],
    },
  },
  query: {
    exclude: ['password'],
  },
})
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
}
