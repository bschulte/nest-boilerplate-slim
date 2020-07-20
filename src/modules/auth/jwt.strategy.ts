import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SESSION_USER } from '../../shared/constants';
import { UserService } from '../user/user.service';
import { Logger } from '../logger/logger';
import { SessionService } from '../../providers/SessionService';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne({ email: payload.email });

    if (!user) {
      this.logger.debug(`Invalid/expired payload: ${JSON.stringify(payload)}`);
      throw new HttpException(null, HttpStatus.UNAUTHORIZED);
    }
    SessionService.set(SESSION_USER, user);

    return user;
  }
}
