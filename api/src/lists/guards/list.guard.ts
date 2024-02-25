import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ListAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const listId = request.params.id || request.body.listId;

    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
      include: {
        user: true,
      },
    });

    if (user.role === Role.ADMIN) {
      return true;
    }

    if (!user) {
      return false;
    }

    const isCreator = list.creatorId === user.id;
    const isSharedWithUser =
      list.user.find((sharedUser) => sharedUser.id === user.id) !== undefined;

    return isCreator || isSharedWithUser;
  }
}
