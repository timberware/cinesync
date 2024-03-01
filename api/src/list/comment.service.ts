import { Injectable } from '@nestjs/common';
import { CommentDao } from './dao/comment.dao';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private commentDao: CommentDao) {}

  createComment(
    createCommentDto: CreateCommentDto,
    listId: string,
    userId: string,
  ) {
    return this.commentDao.createComment(listId, userId, createCommentDto.text);
  }

  updateComment(updateCommentDto: UpdateCommentDto, commentId: string) {
    return this.commentDao.updateComment(commentId, updateCommentDto.text);
  }

  deleteComment(commentId: string) {
    return this.commentDao.deleteComment(commentId);
  }
}
