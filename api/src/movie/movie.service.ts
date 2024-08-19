import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MovieDao } from './dao/movie.dao';
import { MovieDto } from './dto/movie.dto';
import { TMDBMovieDto } from '../sync/dto/tmdbMovie.dto';
import { TMDBDao } from './dao/tmdb.dao';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class MovieService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private moviesDao: MovieDao,
    private tmdbDao: TMDBDao,
  ) {}

  async getMovies(query: QueryDto) {
    const { listId, userId } = query;
    let movies: MovieDto[] | undefined;
    let count = 0;

    let cacheTag = '';
    if (listId) cacheTag = `${listId}-`;
    if (userId) cacheTag += `${userId}-`;
    cacheTag += 'movies';

    if (cacheTag !== 'movies') movies = await this.cacheManager.get(cacheTag);

    if (!movies) {
      const res = await this.moviesDao.getMovies(query);
      movies = res.movies;
      count = res.count;

      await this.cacheManager.set(cacheTag, movies);
    } else count = movies.length;

    return { movies, count };
  }

  getCount() {
    return this.moviesDao.getCount();
  }

  async createMovies(movies: MovieDto[], listId: string) {
    await this.cacheManager.del(`${listId}-movies`);

    return await this.moviesDao.createMovies(movies, listId);
  }

  getTMDBMovie(tmdbId: number, eTag: string) {
    return this.tmdbDao.getTMDBMovie(tmdbId, eTag);
  }

  async updateMovie(movieData: TMDBMovieDto, eTag: string) {
    try {
      await this.moviesDao.updateMovie(this.tmdbToDao(movieData, eTag));
    } catch {
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

    const lists = await this.moviesDao.getListsContainingMovie(userId, movieId);

    await Promise.all([
      this.cacheManager.del(`${userId}-movies`),
      lists[0].map((l) =>
        this.cacheManager.del(`${l.listId}-${userId}-movies`),
      ),
    ]);

    return await this.moviesDao.updateWatchedStatus(
      movieId,
      userId,
      !!hasWatched,
    );
  }

  async removeMovieFromList(listId: string, movieId: string, userId: string) {
    await Promise.all([
      this.cacheManager.del(`${listId}-movies`),
      this.cacheManager.del(`${listId}-${userId}-movies`),
    ]);

    return this.moviesDao.removeMovieFromList(listId, movieId);
  }

  private tmdbToDao(movie: TMDBMovieDto, eTag: string): MovieDto {
    return {
      title: movie.title,
      description: movie.overview,
      genre: movie.genres.map((g) => g.name),
      releaseDate: movie.release_date,
      posterUrl: movie.poster_path,
      rating: movie.vote_average,
      tmdbId: movie.id,
      eTag,
    } as MovieDto;
  }
}
