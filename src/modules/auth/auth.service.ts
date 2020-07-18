import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = { email: user.username, sub: user.userId };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
