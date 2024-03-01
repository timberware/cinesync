import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListDao } from './dao/list.dao';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { CloneListDto } from './dto/clone-list.dto';
import { MoviesService } from '../movie/movie.service';

interface Comment {
  id: string;
  text: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
}

@Injectable()
export class ListsService {
  constructor(
    private listsDao: ListDao,
    private usersService: UsersService,
    private emailService: EmailService,
    private moviesService: MoviesService,
  ) {}

  async getPublicList(listId: string) {
    return await this.listsDao.getPublicList(listId);
  }

  async getList(listId: string) {
    const list = await this.listsDao.getList(listId);

    if (list?.comments.length > 0) {
      const updatedComment = await Promise.all(
        list.comments.map(async (comment) => {
          const username = await this.usersService.getUsernameById(
            comment.authorId,
          );

          const commentWithUsername: Comment = {
            ...comment,
            username,
          };

          return commentWithUsername;
        }),
      );

      list.comments = updatedComment;
    }

    return list;
  }

  async getLists(userId: string) {
    return await this.listsDao.getLists(userId);
  }

  async getWatchedMovies(userId: string) {
    const watched = await this.listsDao.getWatchedMovies(userId);

    const movieIDs = watched.movie.map((movie) => movie.id);

    return movieIDs;
  }

  async getSharees(listId: string, userId: string) {
    const list = await this.listsDao.getList(listId);
    const sharees = await this.listsDao.getSharees(listId);
    const creator = sharees.user.find((user) => user.id === sharees.creatorId);
    const filteredList = sharees.user.filter((user) => userId !== user.id);

    const userListDetails = await Promise.all(
      filteredList.map(async (user) => {
        const userMovies = await this.getWatchedMovies(user.id);

        const watchedMoviesOnList = list.movie
          .filter((movie) => userMovies.includes(movie.id))
          .map((movie) => movie.id);

        return {
          username: user.username,
          email: user.email,
          creator: user.username === creator?.username,
          watched: watchedMoviesOnList,
        };
      }),
    );

    return userListDetails;
  }

  async createList(body: CreateListDto, userId: string) {
    const list = await this.listsDao.createList(body.name, userId);

    await this.moviesService.createMovies(body.movie, list.id);

    return await this.listsDao.getList(list.id);
  }

  async cloneList(cloneList: CloneListDto, userId: string) {
    const originalList = await this.listsDao.getList(cloneList.listId);

    const clonedListData = {
      name: cloneList.name,
      movie: originalList.movie.map((movie) => ({
        title: movie.title,
        description: movie.description,
        genre: [...movie.genre],
        releaseDate: movie.releaseDate,
        posterUrl: movie.posterUrl,
        rating: movie.rating,
        imdbId: movie.imdbId,
      })),
    };

    const clonedList = await this.createList(
      {
        name: clonedListData.name,
        movie: clonedListData.movie,
      },
      userId,
    );

    return clonedList;
  }

  async updateListPrivacy(listId: string) {
    return await this.listsDao.updateListPrivacy(listId);
  }

  async updateList(updateListDto: UpdateListDto) {
    await this.moviesService.createMovies(
      updateListDto.movie,
      updateListDto.listId,
    );

    return await this.listsDao.updateList(updateListDto);
  }

  async deleteList(listId: string, userId: string) {
    const user = await this.usersService.getUser(userId);
    return await this.listsDao.deleteList(listId, user);
  }

  async deleteListItem(listId: string, movieId: string) {
    return await this.listsDao.deleteListItem(listId, movieId);
  }

  async toggleShareList(listId: string, shareeEmail: string, userId: string) {
    const list = await this.listsDao.getList(listId);
    const user = await this.usersService.getUser(userId);
    const sharee = await this.usersService.getUserByEmail(shareeEmail);

    const l = await this.getLists(sharee.id);
    const isShared = !!l.list.find((shareeList) => shareeList.id === listId);

    await this.emailService.sendListSharingEmail([user, sharee], list);

    return await this.listsDao.toggleShareList(listId, shareeEmail, isShared);
  }

  async toggleShareByUsername(
    listId: string,
    username: string,
    userId: string,
  ) {
    const list = await this.listsDao.getList(listId);
    const user = await this.usersService.getUser(userId);
    const sharee = await this.usersService.getUserByUsername(username);

    const l = await this.getLists(sharee.id);
    const isShared = !!l.list.find((shareeList) => shareeList.id === listId);

    await this.emailService.sendListSharingEmail([user, sharee], list);

    return await this.listsDao.toggleShareList(listId, sharee.email, isShared);
  }
}
