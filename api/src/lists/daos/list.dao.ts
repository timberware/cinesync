import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateListDto } from '../dtos/update-list.dto';
import { CreateListDto } from '../dtos/create-list.dto';
import { Role, User } from '@prisma/client';

@Injectable()
export class ListsDao {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicList(listId: string) {
    const list = await this.getList(listId);

    if (!list.isPrivate) {
      return list;
    }

    throw new BadRequestException('List is private');
  }

  async getList(listId: string) {
    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
      select: {
        id: true,
        name: true,
        isPrivate: true,
        creatorId: true,
        createdAt: true,
        updatedAt: true,
        movie: true,
        user: true,
        comments: {
          select: {
            id: true,
            text: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    list.user = list.user.filter((user) => user.id === list.creatorId);

    return list;
  }

  async getLists(userId: string) {
    const l = await this.prisma.list.findMany({
      where: {
        user: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        isPrivate: true,
        creatorId: true,
        createdAt: true,
        updatedAt: true,
        movie: true,
      },
    });

    return { list: l };
  }

  async getSharees(listId: string) {
    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
      include: {
        user: {
          orderBy: {
            username: 'asc',
          },
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return list;
  }

  async getWatchedMovies(userId: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        movie: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async createList(createList: CreateListDto, userId: string) {
    let newMovies;
    const list = await this.prisma.list.create({
      data: {
        id: uuidv4(),
        name: createList.name,
        isPrivate: true,
        creatorId: userId,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        movie: true,
      },
    });

    if (createList?.movie?.length) {
      newMovies = await Promise.all(
        createList.movie.map((movie) =>
          this.prisma.movie.upsert({
            where: { imdbId: movie.imdbId },
            create: {
              id: uuidv4(),
              title: movie.title,
              description: movie.description,
              genre: movie.genre,
              releaseDate: movie.releaseDate,
              posterUrl: movie.posterUrl,
              rating: movie.rating,
              imdbId: movie.imdbId,
            },
            update: {},
          }),
        ),
      );

      await Promise.all(
        newMovies.map((movie) =>
          this.prisma.movie.update({
            where: { id: movie.id },
            data: {
              list: {
                connect: {
                  id: list.id,
                },
              },
            },
          }),
        ),
      );
    }

    const createdList = await this.prisma.list.findUniqueOrThrow({
      where: { id: list.id },
      include: {
        movie: true,
      },
    });

    return createdList;
  }

  async updateListPrivacy(listId: string) {
    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
      include: { user: true, movie: true },
    });

    return await this.prisma.list.update({
      where: { id: listId },
      data: {
        isPrivate: !list.isPrivate,
      },
    });
  }

  async updateList(updateListDto: UpdateListDto) {
    let newMovies = [];

    if (updateListDto?.movie?.length) {
      newMovies = await Promise.all(
        updateListDto.movie.map((movie) =>
          this.prisma.movie.upsert({
            where: { imdbId: movie.imdbId },
            create: {
              id: uuidv4(),
              title: movie.title,
              description: movie.description,
              genre: movie.genre,
              releaseDate: movie.releaseDate,
              posterUrl: movie.posterUrl,
              rating: movie.rating,
              imdbId: movie.imdbId,
            },
            update: {},
          }),
        ),
      );

      await Promise.all(
        newMovies.map((movie) =>
          this.prisma.movie.update({
            where: { id: movie.id },
            data: {
              list: {
                connect: {
                  id: updateListDto.listId,
                },
              },
            },
          }),
        ),
      );
    }

    return await this.prisma.list.update({
      where: { id: updateListDto.listId },
      data: {
        name: updateListDto.name,
      },
      include: { movie: true },
    });
  }

  async updateWatchedStatus(movieId: string, userId: string) {
    const user = await this.getWatchedMovies(userId);

    const hasWatched = user.movie.find(
      (watchedMovie) => watchedMovie.id === movieId,
    );

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        movie: {
          ...(hasWatched
            ? {
                disconnect: { id: movieId },
              }
            : {
                connect: { id: movieId },
              }),
        },
      },
    });
  }

  async deleteList(listId: string, user: User) {
    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: listId },
      select: { creatorId: true },
    });

    if (list.creatorId === user.id || user.role === Role.ADMIN) {
      await this.prisma.user.update({
        where: { id: list.creatorId },
        data: {
          list: {
            disconnect: { id: listId },
          },
        },
      });

      return await this.prisma.list.delete({
        where: { id: listId },
      });
    }
  }

  async deleteListItem(listId: string, movieId: string) {
    await this.prisma.list.update({
      where: { id: listId },
      data: {
        movie: {
          disconnect: { id: movieId },
        },
      },
    });
  }

  async toggleShareList(listId: string, email: string, isShared: boolean) {
    return await this.prisma.list.update({
      where: { id: listId },
      data: {
        user: {
          ...(isShared
            ? {
                disconnect: { email },
              }
            : {
                connect: { email },
              }),
        },
      },
    });
  }
}
