import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ListService } from '../list.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ShareListAuthGuard implements CanActivate {
  constructor(
    private listService: ListService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const sharee = request.body.username || request.body.email;
    const listId = request.params.id || request.body.listId;
    const { creatorId } = await this.listService.getList(listId);
    const creator = await this.usersService.getUser(creatorId);

    if (user.username === sharee || user.email === sharee) {
      throw new BadRequestException('Cannot unshare user from their own list');
    }

    if (user.username !== creator.username || user.email !== creator.email) {
      throw new BadRequestException(
        'Sharees cannot share or unshare a list they do not own',
      );
    }

    return true;
  }
}
