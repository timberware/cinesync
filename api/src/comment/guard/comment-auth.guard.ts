import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CommentsService } from '../comment.service';

@Injectable()
export class CommentAuthorizationGuard implements CanActivate {
  constructor(private commentService: CommentsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const { commentId } = request.params;

    const [comments] = await Promise.all([
      this.commentService.getComments({
        commentId,
      }),
    ]);

    const comment = comments.find((c) => c.id === commentId);

    if (!user) {
      return false;
    }

    if (!comment || !commentId) {
      return false;
    }

    if (comment.userId === user.id) {
      return true;
    }

    return false;
  }
}
