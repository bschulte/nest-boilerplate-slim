import { User } from '../../src/modules/user/user.entity';
import { Role } from '../../src/enums/roles';

export const mockUser: User = {
  email: 'test@test.com',
  password: '1234',
  passwordResetToken: null,
  passwordResetTokenExpires: null,
  role: Role.USER,
  permissions: [],
};
