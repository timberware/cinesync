import { Inject, Injectable } from '@nestjs/common';
import { CommentDao } from './dao/comment.dao';
import { CommentDto, CommentQueryDto } from './dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private commentDao: CommentDao,
  ) {}

  async get(query: CommentQueryDto): Promise<CommentDto[]> {
    if (query.listId && !query.userId && !query.commentId) {
      let comments = await this.cacheManager.get<CommentDto[]>(
        `${query.listId}-comments`,
      );

      if (comments) {
        return comments;
      }

      comments = await this.commentDao.getComments(query);
      await this.cacheManager.set(`${query.listId}-comments`, comments);

      return comments;
    }

    return await this.commentDao.getComments(query);
  }

  async create(comment: string, listId: string, userId: string) {
    await this.cacheManager.del(`${listId}-comments`);

    return this.commentDao.createComment(listId, userId, comment);
  }

  async update(comment: string, commentId: string, listId: string) {
    await this.cacheManager.del(`${listId}-comments`);

    return this.commentDao.updateComment(commentId, comment);
  }

  async delete(commentId: string, listId: string) {
    await this.cacheManager.del(`${listId}-comments`);

    return this.commentDao.deleteComment(commentId);
  }
}
