import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from '../../providers/UtilService';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { mockUser } from '../../../test/mockData/mockUser';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [UserModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('Should properly validate a user', async () => {
    jest.spyOn(UtilService, 'validateHash').mockImplementation(() => true);
    jest.spyOn(userService, 'findOne').mockImplementation(async () => mockUser);

    const validatedUser = await authService.validateUser(
      'test@test.com',
      '1234',
    );

    expect(validatedUser.email).toBe(mockUser.email);
  });
});
