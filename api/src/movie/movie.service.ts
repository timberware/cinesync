import { Injectable } from '@nestjs/common';
import { MoviesDao } from './dao/movie.dao';
import { MovieDto } from './dto/movie.dto';

@Injectable()
export class MovieService {
  constructor(private moviesDao: MoviesDao) {}

  async getMovies(userId?: string, listId?: string) {
    return await this.moviesDao.getMovies(userId, listId);
  }

  async createMovies(movies: MovieDto[], listId: string) {
    return await this.moviesDao.createMovies(movies, listId);
  }

  async updateWatchedStatus(movieId: string, userId: string) {
    const watchedMovies = await this.getMovies(userId);

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
