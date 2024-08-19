import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryDto } from './dto/query.dto';
import { UserDao } from './dao/user.dao';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';

export type FriendStatus = 'ACCEPT' | 'REJECT' | 'SENT' | 'PENDING';

@Injectable()
export class UserService {
  constructor(private usersDao: UserDao) {}

  async getUsers(query: QueryDto) {
    const users = await this.usersDao.getUsers(query);

    const strippedUsers = plainToInstance(UserDto, users.users, {
      excludeExtraneousValues: true,
    });

    return { users: strippedUsers, count: users.count };
  }

  async getUser(userId: string) {
    return await this.usersDao.getUser(userId);
  }

  async getUserData(userId: string) {
    return await this.usersDao.getUserData(userId);
  }

  async getUserStats(userId: string) {
    return await this.usersDao.getUserStats(userId);
  }

  async getFriends(userId: string) {
    const { user1, user2 } = await this.usersDao.getFriends(userId);

    const friends = user1.map((user) => {
      let status = 'SENT';

      const possibleFriend = user2.find(
        (user_2) => user_2.userId1 === user.userId2,
      );

      if (possibleFriend?.isFriend && user.isFriend) {
        status = 'ACCEPT';
      } else if (!possibleFriend?.isFriend && !user.isFriend) {
        status = 'REJECT';
      } else if (!user.isFriend) {
        status = 'PENDING';
      }

      return { user: user.userId2, status };
    });

    return Promise.all(
      friends.map(async (friend) => {
        const { username } = await this.getUser(friend.user);

        return { username, status: friend.status };
      }),
    );
  }

  async sendFriendRequest(userId: string, newFriend: string) {
    const { users } = await this.usersDao.getUsers({
      username: newFriend,
    } as QueryDto);

    try {
      await this.usersDao.createFriendship(userId, users[0].id);
    } catch {
      throw new BadRequestException('Friendship already exists');
    }
  }

  async updateFriendship(
    userId: string,
    newFriend: string,
    status: FriendStatus,
  ) {
    const { users } = await this.usersDao.getUsers({
      username: newFriend,
    } as QueryDto);

    await this.usersDao.updateFriendship(userId, users[0].id, status);
  }

  async updateUser(userId: string, attrs: Partial<CreateUserDto>) {
    return await this.usersDao.updateUser(userId, attrs);
  }
}
