import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { MovieDto } from '../dto/movie.dto';

@Injectable()
export class MoviesDao {
  constructor(private readonly prisma: PrismaService) {}

  async createMovies(movies: MovieDto[], listId: string) {
    let newMovies;

    if (movies?.length) {
      newMovies = await Promise.all(
        movies.map((movie) =>
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

  getMovies(movieId?: string, userId?: string) {
    return this.prisma.movie.findMany({
      where: {
        AND: [{ user: { some: { id: userId } } }, { id: movieId }],
      },
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

  async removeMovieFromList(listId: string, movieId: string) {
    await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        list: {
          disconnect: { id: listId },
        },
      },
    });
  }
}
