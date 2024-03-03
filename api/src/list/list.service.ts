import { Injectable } from '@nestjs/common';
import { ListDao } from './dao/list.dao';
import { UsersService } from '../users/users.service';
import { UpdateListDto } from './dto';
import { CommentDto } from '../comment/dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypes } from '../notification/templates';
import { CommentsService } from '../comment/comment.service';

@Injectable()
export class ListService {
  constructor(
    private listDao: ListDao,
    private usersService: UsersService,
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
          this.usersService.getUsernameById(comment.userId),
        ),
      );

      comments.forEach((comment, i) =>
        commentsWithUsername.push({
          ...comment,
          username: users[i],
        }),
      );
    }

    return { ...list, comments: commentsWithUsername };
  }

  async getLists(userId: string) {
    return await this.listDao.getLists(userId);
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
    const user = await this.usersService.getUser(userId);
    return await this.listDao.deleteList(listId, user);
  }

  async toggleShareList(listId: string, shareeEmail: string, userId: string) {
    const list = await this.listDao.getList(listId);
    const user = await this.usersService.getUser(userId);
    const sharee = await this.usersService.getUserByEmail(shareeEmail);

    const l = await this.getLists(sharee.id);
    const isShared = !!l.list.find((shareeList) => shareeList.id === listId);

    await this.notificationService.send(
      {
        shareeEmail: sharee.email,
        shareename: sharee.username,
        userEmail: user.email,
        username: user.username,
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
    const user = await this.usersService.getUser(userId);
    const sharee = await this.usersService.getUserByUsername(username);

    const l = await this.getLists(sharee.id);
    const isShared = !!l.list.find((shareeList) => shareeList.id === listId);

    await this.notificationService.send(
      {
        shareeEmail: sharee.email,
        shareename: sharee.username,
        userEmail: user.email,
        username: user.username,
        listId: list.id,
        listName: list.name,
      },
      NotificationTypes.LIST_SHARING,
    );

    return await this.listDao.toggleShareList(listId, sharee.email, isShared);
  }
}
