import { Injectable } from '@nestjs/common';
import * as mailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

import { Logger } from '../logger/logger';

/**
 * Templates for emails to send. Each should return a template string that
 * utilizes the parameters that are passed in to the template function.
 */
const emailTemplates = {
  passwordReset: (token?: string) => {
    return `
      A password reset has been requested for your user account. Please use <a href="insert_link_here?token=${token}">this link</a> to reset your password.
        <br /><br />
      The link will remain valid for 4 hours.
        <br /><br />
      If you did not request this password reset, please contact support.
    `;
  },

  passwordChangeNotification: () => {
    return `
      Your password has successfully been changed.
        <br /><br />
      If you did not request this password change, please contact support.
    `;
  },
};

@Injectable()
export class EmailService {
  private transporter: Mail;
  private logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {}

  /**
   * When the module inits, setup the email account that'll
   * be used to send emails.
   */
  onModuleInit() {
    // For the development environment, utilize a dummy email account which
    // will print out a link to view what the email will look like
    if (process.env.NODE_ENV === 'development') {
      mailer.createTestAccount((err, account) => {
        if (err) {
          this.logger.error(`Error creating test account: ${err}`);
          return;
        }

        this.logger.debug(`Test email account user: ${account.user}`);
        this.transporter = mailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });
      });
    } else {
      this.logger.silly('Creating standard gmail email account');
      this.transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get<string>('ROBOT_EMAIL_USERNAME'),
          pass: this.configService.get<string>('ROBOT_EMAIL_PASSWORD'),
        },
      });
    }
  }

  /**
   * Main method to send an email. The templateParams will be provided to the template
   * method for use in the template strings there.
   */
  async sendEmail({
    subject,
    templateName,
    templateParams,
    to,
  }: {
    subject: string;
    templateName: keyof typeof emailTemplates;
    templateParams: any[];
    to: string | string[];
  }) {
    const text = emailTemplates[templateName](...templateParams);

    try {
      const mailOptions = {
        from: 'robot@kryptowire.com',
        to: typeof to === 'string' ? [to] : to,
        subject,
        text,
      };

      const emailResult = await this.transporter.sendMail(mailOptions);
      this.logger.silly(
        `${templateName} email sent, response: ${JSON.stringify(emailResult)}`,
      );

      if (this.configService.get<string>('NODE_ENV') === 'development') {
        this.printTestEmailLink(emailResult);
      }
    } catch (err) {
      this.logger.warn(`Error sending ${templateName} email: ${err}`);
      return false;
    }
    return true;
  }

  /**
   * Helper function to print out the link to the test email in a dev environment
   *
   * @param emailResult
   */
  private printTestEmailLink(emailResult: any) {
    this.logger.debug(
      `Test email URL: ${mailer.getTestMessageUrl(emailResult)}`,
    );
  }
}
