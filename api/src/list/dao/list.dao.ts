import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Role, User } from '@prisma/client';
import { UpdateListDto } from '../dto/update-list.dto';
import { QueryDto } from '../dto/query.dto';
import { ListDTO } from '../dto';

@Injectable()
export class ListDao {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicList(listId: string, userId: string) {
    const list = await this.getList(listId, userId);

    if (list.isPrivate) {
      throw new BadRequestException('List is private');
    }

    return list;
  }

  async getList(listId: string, userId: string) {
    const list: ListDTO = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
      ...(userId && {
        include: {
          listUser: {
            where: {
              userId: userId,
            },
            select: {
              lastVisited: true,
            },
          },
        },
      }),
    });

    return { ...list, lastVisited: list.listUser?.[0].lastVisited };
  }

  async getLists(query: QueryDto) {
    const userCondition = {
      listUser: {
        some: {
          userId: query.id,
        },
      },
    };

    const queryCondition: Prisma.ListWhereInput = {
      AND: [
        {
          ...(query.shared
            ? {
                NOT: { creatorId: query.id },
                ...userCondition,
              }
            : {
                creatorId: query.id,
                ...userCondition,
              }),
        },
        {
          ...(query.search && {
            OR: [
              {
                name: this.prisma.getPrismaSearch(query.search),
              },
            ],
          }),
        },
      ],
    };

    const [lists, count]: [ListDTO[], number] = await Promise.all([
      this.prisma.list.findMany({
        where: queryCondition,
        ...this.prisma.getPagination(query),
        orderBy: {
          name: 'asc',
        },
        ...(query.id && {
          include: {
            listUser: {
              where: {
                userId: query.id,
              },
              select: {
                lastVisited: true,
              },
            },
          },
        }),
      }),
      this.prisma.list.count({
        where: queryCondition,
      }),
    ]);

    return {
      lists: lists.map((l) => ({
        ...l,
        lastVisited: l.listUser?.[0].lastVisited,
      })),
      count,
    };
  }

  async getSharees(listId: string, currentUser: string) {
    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
      include: {
        listUser: {
          where: {
            NOT: {
              userId: currentUser,
            },
          },
          orderBy: {
            User: {
              username: 'asc',
            },
          },
          include: {
            User: true,
          },
        },
      },
    });

    return list.listUser.map((lu) => lu.User);
  }

  async createList(listName: string, userId: string) {
    return await this.prisma.list.create({
      data: {
        name: listName,
        isPrivate: true,
        creatorId: userId,
        listUser: {
          create: {
            userId,
          },
        },
      },
    });
  }

  async updateListPrivacy(listId: string) {
    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
    });

    return await this.prisma.list.update({
      where: { id: listId },
      data: {
        isPrivate: !list.isPrivate,
      },
    });
  }

  async updateList(listId: string, listUpdate: UpdateListDto) {
    return await this.prisma.list.update({
      where: { id: listId },
      data: listUpdate,
    });
  }

  async deleteList(listId: string, user: User) {
    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
      select: { creatorId: true },
    });

    if (list.creatorId === user.id || user.role === Role.ADMIN) {
      return await this.prisma.list.delete({
        where: { id: listId },
      });
    }
  }

  async toggleShareList(listId: string, email: string, isShared: boolean) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    if (isShared) {
      return await this.prisma.listUser.delete({
        where: {
          listId_userId: {
            listId,
            userId: user.id,
          },
        },
      });
    }

    return await this.prisma.listUser.create({
      data: {
        listId,
        userId: user.id,
      },
    });
  }

  updateListUser(listId: string, userId: string) {
    return this.prisma.listUser.update({
      where: {
        listId_userId: {
          listId,
          userId,
        },
      },
      data: {
        lastVisited: new Date(),
      },
    });
  }
}
