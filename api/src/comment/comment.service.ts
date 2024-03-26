import { Injectable } from '@nestjs/common';
import { CommentDao } from './dao/comment.dao';
import { CommentQueryDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(private commentDao: CommentDao) {}

  getComments(query: CommentQueryDto) {
    return this.commentDao.getComments(query);
  }

  createComment(comment: string, listId: string, userId: string) {
    return this.commentDao.createComment(listId, userId, comment);
  }

  updateComment(comment: string, commentId: string) {
    return this.commentDao.updateComment(commentId, comment);
  }

  deleteComment(commentId: string) {
    return this.commentDao.deleteComment(commentId);
  }
}
