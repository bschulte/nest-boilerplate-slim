import * as cls from 'cls-hooked';
import * as uniqid from 'uniqid';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

import { SESSION_NAMESPACE, REQUEST_ID } from '../shared/constants';
import { SessionService } from '../providers/SessionService';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  public static createDefault() {
    return (
      cls.getNamespace(SESSION_NAMESPACE) ||
      cls.createNamespace(SESSION_NAMESPACE)
    );
  }

  public use(req: Request, res: Response, next: NextFunction) {
    const session = SessionMiddleware.createDefault();

    session.run(async () => {
      SessionService.set(REQUEST_ID, uniqid());
      next();
    });
  }
}
