import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';

import { UtilService } from '../../providers/UtilService';
import { UserService } from '../user/user.service';
import { Logger } from '../logger/logger';
import { User } from '../user/user.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
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

  async generatePasswordReset(email: string) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new HttpException(
        'Could not find user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.debug(`Sending password reset email for user: ${email}`);

    const passwordResetToken = UtilService.generateRandomString(48);
    user.passwordResetTokenExpires = moment()
      .add('4', 'hours')
      .toDate();
    user.passwordResetToken = passwordResetToken;

    await this.usersService.save(user);

    await this.emailService.sendEmail({
      to: email,
      templateName: 'passwordReset',
      templateParams: [passwordResetToken],
      subject: 'Password Reset',
    });

    return { msg: 'Sent password reset email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findOne({
      passwordResetToken: token,
    });

    if (!user) {
      throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
    }

    if (moment().isBefore(moment(user.passwordResetTokenExpires))) {
      this.logger.warn(`Password reset token has expired`);
    }

    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    user.password = newPassword;

    await this.usersService.save(user);

    return { msg: 'Successfully changed password' };
  }
}
