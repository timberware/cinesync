import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { MovieDto } from '../dto/movie.dto';
import { QueryDto } from '../dto/query.dto';

@Injectable()
export class MovieDao {
  constructor(private readonly prisma: PrismaService) {}

  async createMovies(movies: MovieDto[], listId: string) {
    let newMovies;

    if (movies?.length) {
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
          this.prisma.movie.update({
            where: { id: movie.id },
            data: {
              list: {
                connect: {
                  id: listId,
                },
              },
            },
          }),
        ),
      );
    }

    return newMovies;
  }

  async getMovies(query: QueryDto) {
    return await this.prisma.movie.findMany({
      where: {
        ...(query?.userId && {
          user: {
            some: {
              id: query?.userId,
            },
          },
        }),
        ...(query?.listId && {
          list: {
            some: {
              id: query?.listId,
            },
          },
        }),
      },
      take: query?.per_page || 10,
      skip: (query?.page_number || 0) * (query?.per_page || 10),
    });
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
        list: {
          disconnect: { id: listId },
        },
      },
    });
  }
}
