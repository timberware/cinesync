import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { QueryDto } from '../dto/query.dto';
import { FriendStatus } from '../user.service';
import { Role } from '@prisma/client';
import { PAGE_NUMBER, PER_PAGE } from '../../utils';

@Injectable()
export class UserDao {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(query: QueryDto) {
    const queryCondition = {
      AND: [
        {
          id: query.id,
          username: query.username,
          email: query.email,
        },
      ],
    };

    const [users, count] = await Promise.all([
      this.prisma.user.findMany({
        where: queryCondition,
        take: query.per_page || PER_PAGE,
        skip: (query.page_number || PAGE_NUMBER) * (query.per_page || PER_PAGE),
      }),

      this.prisma.user.count({
        where: queryCondition,
      }),
    ]);

    return { users, count };
  }

  async getUser(userId: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
  }

  async getFriends(userId: string) {
    const friends = await this.prisma.user.findMany({
      where: { id: userId },
      include: {
        friendsWith: true,
        friendsRequest: true,
      },
    });

    return { user1: friends[0].friendsWith, user2: friends[0].friendsRequest };
  }

  async getUserData(userId: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        list: {
          include: {
            listMovie: true,
          },
        },
        movie: true,
      },
    });
  }

  async createUser(user: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        avatarName: user.avatarName,
        id: uuidv4(),
        role: Role.USER,
      },
    });
  }

  createFriendship(userId: string, friendId: string) {
    return Promise.all([
      this.prisma.friends.create({
        data: {
          user_1: { connect: { id: userId } },
          user_2: { connect: { id: friendId } },
          isFriend: true,
        },
      }),
      this.prisma.friends.create({
        data: {
          user_2: { connect: { id: userId } },
          user_1: { connect: { id: friendId } },
          isFriend: false,
        },
      }),
    ]);
  }

  async updateUser(userId: string, attrs: Partial<CreateUserDto>) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: attrs,
    });
  }

  async updateFriendship(
    userId: string,
    friendId: string,
    status: FriendStatus,
  ) {
    if (status === 'ACCEPT') {
      return await this.prisma.friends.update({
        where: {
          userId1_userId2: {
            userId1: userId,
            userId2: friendId,
          },
        },
        data: {
          isFriend: true,
        },
      });
    }

    if (status === 'REJECT') {
      return Promise.all([
        this.prisma.friends.deleteMany({
          where: {
            OR: [
              {
                userId1: userId,
                userId2: friendId,
              },
              {
                userId1: friendId,
                userId2: userId,
              },
            ],
          },
        }),
      ]);
    }
  }

  async deleteUser(userId: string) {
    return await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async getUserStats(userId: string) {
    const [listCount, sharedListCount, movieCount, commentCount] =
      await Promise.all([
        this.prisma.user.findUniqueOrThrow({
          where: { id: userId },
          select: {
            _count: {
              select: {
                list: {
                  where: {
                    AND: [{ creatorId: userId }],
                  },
                },
              },
            },
          },
        }),

        this.prisma.user.findUniqueOrThrow({
          where: { id: userId },
          select: {
            _count: {
              select: {
                list: {
                  where: {
                    NOT: { creatorId: userId },
                  },
                },
              },
            },
          },
        }),

        this.prisma.user.findUniqueOrThrow({
          where: { id: userId },
          select: {
            _count: {
              select: {
                movie: true,
              },
            },
          },
        }),

        this.prisma.user.findUniqueOrThrow({
          where: { id: userId },
          select: {
            _count: {
              select: {
                comments: true,
              },
            },
          },
        }),
      ]);

    return {
      listCount: listCount._count.list,
      sharedListCount: sharedListCount._count.list,
      moviesCount: movieCount._count.movie,
      commentsCount: commentCount._count.comments,
    };
  }
}
