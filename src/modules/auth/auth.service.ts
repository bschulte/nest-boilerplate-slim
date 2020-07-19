import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UtilService } from '../../providers/UtilService';
import { UserService } from '../user/user.service';
import { Logger } from '../logger/logger';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  j;
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });

    if (user && UtilService.validateHash(password, user.password)) {
      const { password, ...result } = user;

      this.logger.debug(`Successfully logged in user: ${user.email}`);
      return result;
    }
    this.logger.warn(
      `Either user does not exist or password was incorrect for user: ${user.email}`,
    );
    return null;
  }

  login(user: User) {
    const payload = { email: user.email, id: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
