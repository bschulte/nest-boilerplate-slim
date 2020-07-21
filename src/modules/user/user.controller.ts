import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../../decorators/permissions.decorator';
import { Permission } from '../../enums/permissions';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { UserService } from './user.service';
import { User } from './user.entity';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['createOneBase', 'getOneBase', 'updateOneBase'],
    createOneBase: {
      decorators: [
        ApiOperation({
          description: 'Register a new user',
        }),
      ],
    },
    getOneBase: {
      decorators: [
        UseGuards(JwtAuthGuard, PermissionsGuard),
        Permissions(Permission.READ_USER),
      ],
    },
  },
  query: {
    exclude: ['password', 'passwordResetToken', 'passwordResetTokenExpires'],
  },
})
@CrudAuth({
  filter: (user: User) => {
    if (user) {
      return { id: user.id };
    }
  },
})
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(public service: UserService) {}
}
