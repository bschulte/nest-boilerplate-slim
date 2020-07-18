import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, getSchemaPath } from '@nestjs/swagger';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    requestBody: {
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(LoginDto) },
          examples: {
            email: {
              value: '{\n  "email": "test@test.com",\n  "password": "pass"\n}',
              summary: 'Sample login credentials',
            },
          },
        },
      },
      description: 'Login information',
    },
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
