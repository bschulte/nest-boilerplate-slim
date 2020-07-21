import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../modules/user/user.entity';
import { Permission } from '../enums/permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    console.log('Checking user:', user);

    if (!user) {
      throw new UnauthorizedException();
    }

    return permissions.every((permission: Permission) =>
      user.permissions.includes(permission),
    );
  }
}
