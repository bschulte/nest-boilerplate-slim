import * as winston from 'winston';
import { Logger as NestLogger } from '@nestjs/common';

export class Logger extends NestLogger {
  private ctx: string;

  public static winstonLogger;

  constructor(ctx: string) {
    super(ctx);

    if (!Logger.winstonLogger) {
      Logger.winstonLogger = winston.createLogger({
        level: 'silly',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),

        transports: [
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
        ],
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

  public log(message: string) {
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
    Logger.winstonLogger.log({
      level,
      message,
      trace,
      context: this.ctx,
    });
  }
}
