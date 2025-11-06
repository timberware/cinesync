import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { MovieDto } from '../dto/movie.dto';
import { QueryDto } from '../dto/query.dto';
import { PER_PAGE, PAGE_NUMBER } from '../../utils';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieDao {
  constructor(private readonly prisma: PrismaService) {}

  async createMovies(movies: MovieDto[], listId: string) {
    let newMovies;

    if (movies.length) {
      newMovies = await Promise.all(
        movies.map((movie) =>
          this.prisma.movie.upsert({
            where: { tmdbId: movie.tmdbId },
            create: {
              id: uuidv4(),
              title: movie.title,
              description: movie.description,
              genre: movie.genre,
              releaseDate: movie.releaseDate,
              posterUrl: movie.posterUrl,
              rating: movie.rating,
              tmdbId: movie.tmdbId,
              eTag: movie.eTag,
            },
            update: {},
          }),
        ),
      );

      await Promise.all(
        newMovies.map((movie) =>
          this.prisma.listMovie.upsert({
            where: {
              listId_movieId: {
                listId,
                movieId: movie.id,
              },
            },
            create: {
              listId,
              movieId: movie.id,
            },
            update: {},
          }),
        ),
      );
    }

    return newMovies;
  }

  async getMovies(query: QueryDto) {
    query.page_number = PAGE_NUMBER;
    query.per_page = PER_PAGE;

    const queryCondition = {
      AND: [
        {
          ...(query.userId && {
            user: {
              some: {
                id: query.userId,
              },
            },
          }),
          ...(query.listId && {
            listMovie: {
              some: {
                listId: query.listId,
              },
            },
          }),
        },
      ],
    };

    const [movies, count] = await Promise.all([
      this.prisma.movie.findMany({
        where: queryCondition,
        ...this.prisma.getPagination(query),
        orderBy: {
          title: 'asc',
        },
      }),
      this.prisma.movie.count({
        where: queryCondition,
      }),
    ]);

    let sortedMovies: Movie[] = [];

    if (query.listId && count) {
      const lm = await this.prisma.listMovie.findMany({
        where: {
          movieId: {
            in: movies.map((m) => m.id),
          },
          listId: query.listId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      lm.forEach((l) => {
        const movie = movies.find((mv) => mv.id === l.movieId);

        if (movie) {
          movie.createdAt = l.createdAt;
          sortedMovies.push(movie);
        }
      });
    } else sortedMovies = movies;

    return { movies: sortedMovies, count };
  }

  getCount() {
    return this.prisma.movie.count();
  }

  async updateWatchedStatus(
    movieId: string,
    userId: string,
    hasWatched: boolean,
  ) {
    return await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        user: {
          ...(hasWatched
            ? {
                disconnect: { id: userId },
              }
            : {
                connect: { id: userId },
              }),
        },
      },
    });
  }

  async updateMovie(movieData: MovieDto) {
    return await this.prisma.movie.update({
      where: { tmdbId: movieData.tmdbId },
      data: movieData,
    });
  }

  async removeMovieFromList(listId: string, movieId: string) {
    return await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        listMovie: {
          delete: { listId_movieId: { listId, movieId } },
        },
      },
    });
  }

  getListsContainingMovie(userId: string, movieId: string) {
    return Promise.all([
      this.prisma.list.findMany({
        where: {
          listMovie: {
            some: {
              movieId,
            },
          },
          listUser: {
            some: {
              userId: userId,
            },
          },
        },
        take: PER_PAGE,
        skip: PAGE_NUMBER * PER_PAGE,
      }),
    ]);
  }
}
