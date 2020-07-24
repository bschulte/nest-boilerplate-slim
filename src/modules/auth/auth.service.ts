import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';

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

  /**
   * Validates an email and password to ensure that the user is present in our
   * db and that the password is correct for the user. This is used by our local
   * strategy for user login.
   *
   * @param email
   * @param password
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });

    if (user && UtilService.validateHash(password, user.password)) {
      const { password, ...result } = user;

      this.logger.debug(`Successfully logged in user: ${user.email}`);
      return result;
    }
    this.logger.warn(
      `Either user does not exist or password was incorrect for user: ${email}`,
    );
    return null;
  }

  /**
   * Service method called by the login route. This will create
   * the JWT to return to the user.
   *
   * @param user
   */
  login(user: User) {
    const payload = { email: user.email, id: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * Generates a password reset token for the user and sends
   * them an email with the URL for resetting their password.
   *
   * @param email
   */
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

  /**
   * Resets the user's password based on the given password reset
   * token and the new password.
   *
   * @param token
   * @param newPassword
   */
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findOne({
      passwordResetToken: token,
    });

    if (!user) {
      throw new NotFoundException('Could not find user');
    }

    if (moment().isBefore(moment(user.passwordResetTokenExpires))) {
      this.logger.warn(`Password reset token has expired`);
      throw new BadRequestException('Reset token expired');
    }

    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    user.password = newPassword;

    await this.usersService.save(user);

    return { msg: 'Successfully changed password' };
  }
}
