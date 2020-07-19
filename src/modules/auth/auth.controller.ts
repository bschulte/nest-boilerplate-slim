import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

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
