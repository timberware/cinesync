import { Injectable } from '@nestjs/common';
import { MoviesDao } from './dao/movies.dao';
import { MovieDto } from '../lists/dtos/movie.dto';

@Injectable()
export class MoviesService {
  constructor(private moviesDao: MoviesDao) {}

  async getMovies(movieId?: string, userId?: string) {
    return this.moviesDao.getMovies(movieId, userId);
  }

  async createMovies(movies: MovieDto[], listId: string) {
    return await this.moviesDao.createMovies(movies, listId);
  }

  async updateWatchedStatus(movieId: string, userId: string) {
    const watchedMovies = await this.getMovies(movieId, userId);

    const hasWatched = !!watchedMovies.find(
      (watchedMovie) => watchedMovie.id === movieId,
    );

    return await this.moviesDao.updateWatchedStatus(
      movieId,
      userId,
      hasWatched,
    );
  }

  async removeMovieFromList(listId: string, movieId: string) {
    return await this.moviesDao.removeMovieFromList(listId, movieId);
  }
}
