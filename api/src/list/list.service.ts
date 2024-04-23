import { Injectable } from '@nestjs/common';
import { ListDao } from './dao/list.dao';
import { UserService } from '../user/user.service';
import { UpdateListDto } from './dto';
import { CommentDto } from '../comment/dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypes } from '../notification/templates';
import { CommentsService } from '../comment/comment.service';
import { QueryDto as UserQueryDto } from '../user/dto/query.dto';

@Injectable()
export class ListService {
  constructor(
    private listDao: ListDao,
    private userService: UserService,
    private notificationService: NotificationService,
    private commentService: CommentsService,
  ) {}

  async getPublicList(listId: string) {
    return await this.listDao.getPublicList(listId);
  }

  async getList(listId: string) {
    const [list, comments] = await Promise.all([
      this.listDao.getList(listId),
      this.commentService.getComments({ listId }),
    ]);

    const commentsWithUsername: CommentDto[] = [];

    if (comments.length) {
      const users = await Promise.all(
        comments.map((comment) =>
          this.userService.getUsers({
            id: comment.userId,
          } as UserQueryDto),
        ),
      );

      comments.forEach((comment, i) =>
        commentsWithUsername.push({
          ...comment,
          username: users[i][0].username,
        }),
      );
    }

    return { ...list, comments: commentsWithUsername };
  }

  async getLists(query: UserQueryDto) {
    return await this.listDao.getLists(query);
  }

  async getSharees(listId: string, userId: string) {
    return await this.listDao.getSharees(listId, userId);
  }

  async createList(name: string, userId: string) {
    const { id } = await this.listDao.createList(name, userId);

    return await this.listDao.getList(id);
  }

  async updateList(listId: string, updateListDto: UpdateListDto) {
    return await this.listDao.updateList(listId, updateListDto);
  }

  async deleteList(listId: string, userId: string) {
    const user = await this.userService.getUser(userId);
    return await this.listDao.deleteList(listId, user);
  }

  async toggleShareList(listId: string, shareeEmail: string, userId: string) {
    const list = await this.listDao.getList(listId);
    const user = await this.userService.getUser(userId);
    const [sharee] = await this.userService.getUsers({
      email: shareeEmail,
    } as UserQueryDto);

    const l = await this.getLists({ id: sharee.id } as UserQueryDto);
    const isShared = !!l.list.find((shareeList) => shareeList.id === listId);

    await this.notificationService.send(
      {
        toEmail: sharee.email,
        toUsername: sharee.username,
        ccEmail: user.email,
        ccUsername: user.username,
        listId: list.id,
        listName: list.name,
      },
      NotificationTypes.LIST_SHARING,
    );
    return await this.listDao.toggleShareList(listId, shareeEmail, isShared);
  }

  async toggleShareByUsername(
    listId: string,
    username: string,
    userId: string,
  ) {
    const list = await this.listDao.getList(listId);
    const user = await this.userService.getUser(userId);
    const [sharee] = await this.userService.getUsers({
      username,
    } as UserQueryDto);

    const l = await this.getLists({ id: sharee.id } as UserQueryDto);
    const isShared = !!l.list.find((shareeList) => shareeList.id === listId);

    await this.notificationService.send(
      {
        toEmail: sharee.email,
        toUsername: sharee.username,
        ccEmail: user.email,
        ccUsername: user.username,
        listId: list.id,
        listName: list.name,
      },
      NotificationTypes.LIST_SHARING,
    );

    return await this.listDao.toggleShareList(listId, sharee.email, isShared);
  }
}
