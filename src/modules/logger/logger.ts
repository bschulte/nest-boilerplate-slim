import * as winston from 'winston';
import * as chalk from 'chalk';
import * as moment from 'moment';
import { Logger as NestLogger } from '@nestjs/common';
import { SessionService } from '../../providers/SessionService';
import { SESSION_USER, REQUEST_ID } from '../../shared/constants';
import { User } from '../user/user.entity';

export class Logger extends NestLogger {
  private ctx: string;

  public static winstonLogger: winston.Logger;

  constructor(ctx: string) {
    super(ctx);

    const customFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.prettyPrint(),
      winston.format.printf(info => formatter(info)),
    );

    const formatter = info => {
      const requestId = SessionService.get(REQUEST_ID) || '-';
      const user: User = SessionService.get(SESSION_USER);
      const email = user ? user.email : '-';

      return [
        moment(info.timestamp).format('YYYY/MM/DD - hh:mm:ss.SSS A'),
        chalk.magentaBright(requestId),
        email,
        `[${info.level}]`,
        `[${chalk.green(info.context)}]`,
        info.message,
      ].join(' ');
    };

    if (!Logger.winstonLogger) {
      const transports = [
        new winston.transports.File({
          filename: 'logs/server.tail.log',
          tailable: true,
          level: 'silly',
          maxFiles: 2,
          maxsize: 5 * 1024 * 1024, // 5 MB
        }),

        new winston.transports.File({
          filename: 'logs/server.log',
          format: winston.format.combine(winston.format.uncolorize()),
          tailable: false,
          level: 'silly',
          maxFiles: 30,
          maxsize: 5 * 1024 * 1024, // 5 MB
        }),
      ];

      if (process.env.NODE_ENV === 'production') {
        transports.push(
          new winston.transports.File({
            filename: 'logs/server.logstash.log',
            tailable: false,
            format: winston.format.combine(
              winston.format.uncolorize(),
              winston.format.json(),
            ),
            level: 'silly',
            maxFiles: 10,
            maxsize: 5 * 1024 * 1024, // 5 MB
          }),
        );
      }

      Logger.winstonLogger = winston.createLogger({
        level: 'silly',
        format: customFormat,
        transports,
      });
    }
    this.ctx = ctx;
  }

  public silly(message: string) {
    Logger.winstonLogger.silly(message, 'silly');
    super.log(message);
  }

  public debug(message: string) {
    this.winstonLog(message, 'debug');
    super.log(message);
  }

  public verbose(message: string) {
    this.winstonLog(message, 'verbose');
    super.log(message);
  }

  public warn(message: string) {
    this.winstonLog(message, 'warn');
    super.warn(message);
  }

  public error(message: string, trace = '') {
    if (trace) {
      this.winstonLog(message, 'error', trace);
      super.error(message, trace);
    } else {
      this.winstonLog(message, 'error');
      super.error(message);
    }
  }

  private winstonLog(
    message: string,
    level: 'silly' | 'verbose' | 'debug' | 'warn' | 'error',
    trace?: string,
  ) {
    const user = SessionService.get(SESSION_USER);
    Logger.winstonLogger.log({
      level,
      message,
      trace,
      context: this.ctx,
      user,
    });
  }
}
