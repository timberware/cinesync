import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      getUserByEmail: (email: string) => {
        const filteredUser = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUser[0]);
      },
      createUser: (createUserDto: CreateUserDto) => {
        const user: User = {
          id: uuidv4(),
          ...createUserDto,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: Role.USER,
          avatarName: null,
        };

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
      imports: [JwtModule, ConfigModule],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup({
      username: 'testuser',
      email: 'test@test.test',
      password: 'test',
    });

    expect(user.password).not.toEqual('test');

    const hash = user.password.split('$');
    const salt = hash[4];
    const password = hash[5];

    expect(salt).toBeDefined();
    expect(password).toBeDefined();
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.validateUser('asdflkj@asdflkj.com', 'asdflkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup({
      username: 'testuser',
      email: 'test@test.test',
      password: 'test',
    });

    await expect(
      service.validateUser('hey@sailor.com', 'wrongpassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup({
      username: 'testuser',
      email: 'test@test.test',
      password: 'test',
    });

    const user = await service.validateUser('test@test.test', 'test');
    expect(user).toBeDefined();
  });
});
