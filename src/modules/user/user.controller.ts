import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
    getOneBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
  },
  query: {
    exclude: ['password', 'passwordResetToken', 'passwordResetTokenExpires'],
  },
})
@CrudAuth({
  filter: (user: User) => ({ id: user.id }),
})
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(public service: UserService) {}
}
