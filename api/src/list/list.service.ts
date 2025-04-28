import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ListDao } from './dao/list.dao';
import { UserService } from '../user/user.service';
import { ListItem, UpdateListDto } from './dto';
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

  async getPublicList(listId: string, userId: string) {
    return await this.listDao.getPublicList(listId, userId);
  }

  async getList(listId: string, userId: string) {
    let list: ListItem | undefined | null = null;
    list = await this.cacheManager.get<ListItem>(listId);
    const comments = await this.commentService.get({ listId });

    if (!list) {
      list = await this.listDao.getList(listId, userId);
      await this.cacheManager.set(listId, list);
    }

    return {
      id: list.id,
      name: list.name,
      isPrivate: list.isPrivate,
      creatorId: list.creatorId,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      lastVisited: list.lastVisited,
      comments,
    };
  }

  async getLists(query: QueryDto) {
    return await this.listDao.getLists(query);
  }

  async getSharees(listId: string, userId: string) {
    let sharees: UserDto[] | undefined | null = await this.cacheManager.get(
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

    return await this.listDao.getList(id, userId);
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
    const list = await this.listDao.getList(listId, userId);
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
    const list = await this.listDao.getList(listId, userId);
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

  updateLastVisited(listId: string, userId: string) {
    return this.listDao.updateListUser(listId, userId);
  }
}
