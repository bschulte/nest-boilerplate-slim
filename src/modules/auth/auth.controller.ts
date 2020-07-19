import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  Get,
} from '@nestjs/common';
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
            sample: {
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

  @Post('generate-password-reset')
  @ApiOperation({
    requestBody: {
      content: {
        'application/json': {
          examples: {
            sample: {
              value: '{ "email": "test@test.com" }',
            },
          },
        },
      },
    },
  })
  async createPasswordReset(@Body('email') email: string) {
    return this.authService.generatePasswordReset(email);
  }

  @Post('reset-password')
  @ApiOperation({
    requestBody: {
      content: {
        'application/json': {
          example:
            '{\n  "email": "test@test.com",\n  "password": "newPassword",\n  "token": "abcd1234"\n}',
        },
      },
    },
  })
  async resetPassword(
    @Body()
    { password, token }: { password: string; token: string },
  ) {
    return this.authService.resetPassword(token, password);
  }
}
