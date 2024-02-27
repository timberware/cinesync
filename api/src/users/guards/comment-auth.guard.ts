import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ListDao } from '../../lists/daos/list.dao';

@Injectable()
export class CommentAuthorizationGuard implements CanActivate {
  constructor(private listsDao: ListDao) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const listId = request.params.id || request.body.listId;
    const commentId = request.param.commentId || request.body.commentId;

    const list = await this.listsDao.getList(listId);

    const comment = list.comments.find((c) => c.id === commentId);

    if (!user) {
      return false;
    }

    if (!comment || !commentId) {
      return false;
    }

    if (list.creatorId === user.id) {
      return true;
    }

    if (comment?.authorId === user.id) {
      return true;
    }

    return false;
  }
}
