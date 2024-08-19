/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { CreateUserDto } from './dto/create-user.dto';

describe.skip('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  let fakeNotificationService: Partial<NotificationService>;

  beforeEach(async () => {
    fakeAuthService = {
      login: () => ({ accessToken: '123' }),
      signup: (createUser: CreateUserDto) => {
        return Promise.resolve({ id: '-1', ...createUser } as User);
      },
      validateUser: (username: string, email: string) => {
        return Promise.resolve({ id: '-1', username, email } as User);
      },
    };
    fakeNotificationService = {
      send: () => {
        return Promise.resolve(undefined);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: NotificationService,
          useValue: fakeNotificationService,
        },
      ],
      imports: [NotificationModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signin returns a jwt', async () => {
    fakeAuthService.login = () => ({ accessToken: '123' });

    const req: any = {
      user: {
        id: '-1',
        username: 'testuser',
        email: 'test@test.test',
        role: Role.USER,
      },
    };
    const user = await controller.signin(req);

    expect(user).toBeDefined();
    expect(user.accessToken).toBeDefined();
  });

  it.skip('signin throws an error if invalid credentials are provided', async () => {
    fakeAuthService.login = () => ({ accessToken: '123' });

    const req: any = {
      user: {
        id: '-1',
        username: 'testuser',
        email: 'test@test.test',
        role: Role.USER,
      },
    };

    await expect(controller.signin(req)).rejects.toThrow(UnauthorizedException);
  });

  it.skip('signup creates a new user and returns it', async () => {
    const user = await controller.signup({
      username: 'newuser',
      email: 'newuser@test.test',
      password: 'newpassword',
    });

    expect(user).toBeDefined();
    expect(user.id).toEqual('-1');
  });
});
