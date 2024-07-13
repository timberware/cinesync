import { BadRequestException, Injectable } from '@nestjs/common';
import { MovieDao } from './dao/movie.dao';
import { MovieDto } from './dto/movie.dto';
import { TMDBMovieDto } from '../sync/dto/tmdbMovie.dto';
import { TMDBDao } from './dao/tmdb.dao';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class MovieService {
  constructor(private moviesDao: MovieDao, private tmdbDao: TMDBDao) {}

  async getMovies(query: QueryDto) {
    const { movies, count } = await this.moviesDao.getMovies(query);

    return { movies, count };
  }

  async createMovies(movies: MovieDto[], listId: string) {
    return await this.moviesDao.createMovies(movies, listId);
  }

  async getTMDBMovie(tmdbId: number, eTag: string) {
    return await this.tmdbDao.getTMDBMovie(tmdbId, eTag);
  }

  async updateMovie(movieData: TMDBMovieDto, eTag: string) {
    try {
      await this.moviesDao.updateMovie(this.tmdbToDao(movieData, eTag));
    } catch (error) {
      throw new BadRequestException(
        `error updating movie with tmdbId ${movieData.id}`,
      );
    }
  }

  async updateWatchedStatus(movieId: string, userId: string) {
    const { movies } = await this.getMovies({ userId });

    const hasWatched = movies.find(
      (watchedMovie) => watchedMovie.id === movieId,
    );

    return await this.moviesDao.updateWatchedStatus(
      movieId,
      userId,
      !!hasWatched,
    );
  }

  async removeMovieFromList(listId: string, movieId: string) {
    return await this.moviesDao.removeMovieFromList(listId, movieId);
  }

  private tmdbToDao(movie: TMDBMovieDto, eTag: string): MovieDto {
    return {
      title: movie.title,
      description: movie.overview,
      genre: movie.genres?.map((g) => g.name),
      releaseDate: movie.release_date,
      posterUrl: movie.poster_path,
      rating: movie.vote_average,
      tmdbId: movie.id,
      eTag,
    } as MovieDto;
  }
}
