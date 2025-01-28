import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TMDBMovieDto } from './dto/tmdbMovie.dto';
import { MovieService } from '../movie/movie.service';
import { MovieDto } from '../movie/dto/movie.dto';

@Injectable()
export class SyncService {
  private logger = new Logger(SyncService.name);
  private BATCH_SIZE = 50;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private movieService: MovieService,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async updateMovies() {
    this.logger.log('Movie Refresh Job Starting');

    const count = await this.movieService.getCount();
    const { movies } = await this.movieService.getMovies({
      per_page: count,
      page_number: 0,
    });

    const movieBatches = this.createBatches(movies, this.BATCH_SIZE);
    const res = (
      await Promise.all(
        movieBatches.map((batch) =>
          Promise.all(
            batch.map((movie) =>
              this.movieService.getTMDBMovie(movie.tmdbId, movie.eTag ?? ''),
            ),
          ),
        ),
      )
    ).flat();

    const modifiedMovies = res.filter(
      (response) =>
        response.status && (response.status as HttpStatus) === HttpStatus.OK,
    );

    const modifiedMoviesCount = modifiedMovies.length;

    this.logger.log(
      `${modifiedMoviesCount.toString()} movie(s) to be updated.`,
    );
    if (modifiedMoviesCount) {
      this.logger.debug('Clearing all cache');
      await this.cacheManager.clear();

      await Promise.all(
        modifiedMovies.map((batch) => {
          this.movieService.updateMovie(
            batch.data as TMDBMovieDto,
            batch.headers.etag as string,
          );
        }),
      );
    }

    this.logger.log('Movie Refresh Job Completed');
  }

  private createBatches = (arr: MovieDto[], size: number) =>
    Array.from(
      { length: Math.ceil(arr.length / size) },
      (_: MovieDto[], i: number) => arr.slice(i * size, i * size + size),
    );
}
