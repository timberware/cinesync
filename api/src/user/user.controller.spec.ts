/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { ListService } from '../list/list.service';
import { ListModule } from '../list/list.module';
import { ImageModule } from '../image/image.module';
import { ImageService } from '../image/image.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthModule } from '../auth/auth.module';
import { QueryDto } from './dto/query.dto';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let fakeNotificationService: Partial<NotificationService>;
  let fakeListService: Partial<ListService>;
  let fakeImageService: Partial<ImageService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      getUser: (id: string) => {
        return Promise.resolve({
          id,
          username: 'testuser',
          email: 'test@test.test',
          password: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as User);
      },
      getUsers: (query: QueryDto) => {
        return Promise.resolve([
          {
            id: query.id,
            username: 'testuser',
            email: query.email,
            password: 'test',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as User,
        ]);
      },
    };
    fakeAuthService = {
      login: () => {
        return Promise.reject(new UnauthorizedException());
      },
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
    fakeListService = {
      getLists: (id: string) => {
        return Promise.resolve({
          id,
          username: 'asdf',
          email: 'asdf@asdf.asdf',
          password: '123',
          createdAt: new Date(),
          updatedAt: new Date(),
          role: Role.USER,
          avatarName: null,
          list: [
            {
              id: '25',
              name: 'My Watchlist_chrischris',
              isPrivate: true,
              creatorId: '123',
              createdAt: new Date(),
              updatedAt: new Date(),
              movie: [
                {
                  id: '1',
                  title: 'Movie2',
                  description: 'Description for Movie 2',
                  genre: ['Horror', 'Family'],
                  releaseDate: '666',
                  posterUrl: '123',
                  rating: 4.5,
                  tmdbId: 123,
                  eTag: '123',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            },
          ],
        });
      },
      deleteList: (listId: string, userId: string) => {
        return Promise.resolve({
          id: listId,
          name: 'test list name',
          isPrivate: true,
          creatorId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      },
    };
    fakeImageService = {
      async getImage(name: string) {
        return Buffer.from(name);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: NotificationService,
          useValue: fakeNotificationService,
        },
        {
          provide: ListService,
          useValue: fakeListService,
        },
        {
          provide: ImageService,
          useValue: fakeImageService,
        },
      ],
      imports: [NotificationModule, ListModule, ImageModule, AuthModule],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it.skip('getUsers returns a user with the given email', async () => {
    const [user] = await controller.getUsers({
      email: 'test@test.test',
    } as QueryDto);

    expect(user).toBeDefined();
    expect(user?.id).toEqual('-1');
    expect(user?.username).toEqual('testuser');
    expect(user?.email).toEqual('test@test.test');
  });

  it.skip('getUsers returns a user with the given id', async () => {
    const [user] = await controller.getUsers({ id: '-1' } as QueryDto);

    expect(user).toBeDefined();
    expect(user?.id).toEqual('-1');
  });

  it.skip('getUsers throws an error if user with given id is not found', async () => {
    fakeUserService.getUsers = () => Promise.reject(new NotFoundException());

    await expect(controller.getUsers({ id: '-1' } as QueryDto)).rejects.toThrow(
      NotFoundException,
    );
  });
});
