import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { UpdateListDto } from '../dto/update-list.dto';
import { QueryDto } from '../dto/query.dto';
import { PER_PAGE, PAGE_NUMBER } from '../../utils';

@Injectable()
export class ListDao {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicList(listId: string) {
    const list = await this.getList(listId);

    if (!list.isPrivate) {
      return list;
    }

    throw new BadRequestException('List is private');
  }

  async getList(listId: string) {
    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
    });

    return list;
  }

  async getLists(query: QueryDto) {
    const userCondition = {
      listUser: {
        some: {
          userId: query.id,
        },
      },
    };

    const queryCondition = {
      ...(query.shared
        ? {
            AND: {
              NOT: { creatorId: query.id },
              ...userCondition,
            },
          }
        : {
            AND: { creatorId: query.id, ...userCondition },
          }),
    };

    const [lists, count] = await Promise.all([
      this.prisma.list.findMany({
        where: queryCondition,
        take: query.per_page || PER_PAGE,
        skip: (query.page_number || PAGE_NUMBER) * (query.per_page || PER_PAGE),
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.list.count({
        where: queryCondition,
      }),
    ]);

    return { lists, count };
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
}
