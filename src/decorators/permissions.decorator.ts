import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permissions';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);
