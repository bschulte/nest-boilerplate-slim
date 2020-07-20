import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
