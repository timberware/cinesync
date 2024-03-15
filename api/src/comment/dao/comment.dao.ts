import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CommentQueryDto } from '../dto';

@Injectable()
export class CommentDao {
  constructor(private readonly prisma: PrismaService) {}

  async getComments(query: CommentQueryDto) {
    return this.prisma.comment.findMany({
      where: {
        AND: [
          {
            id: query?.commentId,
            list: {
              id: query?.listId,
            },
            user: {
              id: query?.userId,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createComment(listId: string, userId: string, text: string) {
    return await this.prisma.comment.create({
      data: {
        text,
        user: { connect: { id: userId } },
        list: { connect: { id: listId } },
      },
    });
  }

  updateComment(commentId: string, text: string) {
    return this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text,
      },
    });
  }

  deleteComment(commentId: string) {
    return this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
