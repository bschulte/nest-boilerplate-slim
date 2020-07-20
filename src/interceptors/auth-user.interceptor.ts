import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { SessionService } from '../providers/SessionService';
import { User } from '../modules/user/user.entity';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const user = <User>request.user;
    if (user) {
      SessionService.set('user', user);
    }

    return next.handle();
  }
}
