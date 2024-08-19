import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ListDao } from './dao/list.dao';
import { UserService } from '../user/user.service';
import { ListItem, UpdateListDto } from './dto';
import { CommentDto } from '../comment/dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypes } from '../notification/templates';
import { CommentsService } from '../comment/comment.service';
import { QueryDto } from './dto/query.dto';
import { QueryDto as UserQueryDto } from '../user/dto/query.dto';
import { UserDto } from './dto/sharee.dto';

@Injectable()
export class ListService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private listDao: ListDao,
    private userService: UserService,
    private notificationService: NotificationService,
    private commentService: CommentsService,
  ) {}

  async getPublicList(listId: string) {
    return await this.listDao.getPublicList(listId);
  }

  async getList(listId: string) {
    let list: ListItem | undefined = await this.cacheManager.get(listId);

    let comments: CommentDto[] | undefined = await this.cacheManager.get(
      `${listId}-comments`,
    );

    if (!list) {
      list = await this.listDao.getList(listId);
      await this.cacheManager.set(listId, list);
    }

    if (!comments) {
      const c = await this.commentService.getComments({ listId });

      const commentsWithUsername: CommentDto[] = [];

      if (c.length) {
        const users = await Promise.all(
          c.map((comment) =>
            this.userService.getUsers({
              id: comment.userId,
            } as QueryDto),
          ),
        );

        c.forEach((comment, i) =>
          commentsWithUsername.push({
            ...comment,
            username: users[i].users[0].username,
          }),
        );
      }
      comments = commentsWithUsername;

      await this.cacheManager.set(`${listId}-comments`, comments);
    }

    return { ...list, comments };
  }

  async getLists(query: QueryDto) {
    return await this.listDao.getLists(query);
  }

  async getSharees(listId: string, userId: string) {
    let sharees: UserDto[] | undefined = await this.cacheManager.get(
      `${listId}-${userId}-sharees`,
    );

    if (!sharees) {
      sharees = await this.listDao.getSharees(listId, userId);
      if (sharees.length)
        await this.cacheManager.set(`${listId}-${userId}-sharees`, sharees);
    }
    return sharees;
  }

  async createList(name: string, userId: string) {
    const { id } = await this.listDao.createList(name, userId);

    return await this.listDao.getList(id);
  }

  async updateList(listId: string, updateListDto: UpdateListDto) {
    await this.cacheManager.del(listId);

    return await this.listDao.updateList(listId, updateListDto);
  }

  async deleteList(listId: string, userId: string) {
    const user = await this.userService.getUser(userId);
    await this.cacheManager.del(listId);

    return await this.listDao.deleteList(listId, user);
  }

  async toggleShareList(listId: string, shareeEmail: string, userId: string) {
    const list = await this.listDao.getList(listId);
    const user = await this.userService.getUser(userId);
    const { users: sharee } = await this.userService.getUsers({
      email: shareeEmail,
    } as UserQueryDto);

    const l = await this.getLists({
      id: sharee[0].id,
      shared: true,
    } as QueryDto);
    const isShared = !!l.lists.find((shareeList) => shareeList.id === listId);

    this.notificationService.send(
      {
        toEmail: sharee[0].email,
        toUsername: sharee[0].username,
        ccEmail: user.email,
        ccUsername: user.username,
        listId: list.id,
        listName: list.name,
      },
      NotificationTypes.LIST_SHARING,
    );
    await this.cacheManager.del(`${listId}-${userId}-sharees`);

    return await this.listDao.toggleShareList(listId, shareeEmail, isShared);
  }

  async toggleShareByUsername(
    listId: string,
    username: string,
    userId: string,
  ) {
    const list = await this.listDao.getList(listId);
    const user = await this.userService.getUser(userId);
    const { users: sharee } = await this.userService.getUsers({
      username,
    } as UserQueryDto);

    const l = await this.getLists({
      id: sharee[0].id,
      shared: true,
    } as QueryDto);
    const isShared = !!l.lists.find((shareeList) => shareeList.id === listId);

    this.notificationService.send(
      {
        toEmail: sharee[0].email,
        toUsername: sharee[0].username,
        ccEmail: user.email,
        ccUsername: user.username,
        listId: list.id,
        listName: list.name,
      },
      NotificationTypes.LIST_SHARING,
    );

    await this.cacheManager.del(`${listId}-${userId}-sharees`);

    return await this.listDao.toggleShareList(
      listId,
      sharee[0].email,
      isShared,
    );
  }
}
