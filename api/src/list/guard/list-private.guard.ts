import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ListService } from '../list.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class ListPrivacyAuthGuard implements CanActivate {
  constructor(
    private listService: ListService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const listId = request.params.id || request.body.listId;
    const { creatorId } = await this.listService.getList(listId, user.id);
    const creator = await this.userService.getUser(creatorId);

    if (user.username !== creator.username || user.email !== creator.email) {
      throw new BadRequestException(
        "Sharees cannot alter a list's privacy they do not own",
      );
    }

    return true;
  }
}
