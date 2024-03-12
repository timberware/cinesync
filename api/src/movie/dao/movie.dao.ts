import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { MovieDto } from '../dto/movie.dto';

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

  getMovies(userId?: string, listId?: string) {
    return this.prisma.movie.findMany({
      where: {
        user: userId ? { some: { id: userId } } : undefined,
        list: listId ? { some: { id: listId } } : undefined,
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
