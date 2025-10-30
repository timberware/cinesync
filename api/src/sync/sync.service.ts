import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TMDBMovieDto } from './dto/tmdbMovie.dto';
import { MovieService } from '../movie/movie.service';
import { MovieDto } from '../movie/dto/movie.dto';
import axios from 'node_modules/axios/index.cjs';

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
    const fetchedMovies: (axios.AxiosResponse<TMDBMovieDto> | null)[] = [];

    for (const batch of movieBatches) {
      const fetchedBatch = await Promise.all(
        batch.map((movie) =>
          this.movieService.getTMDBMovie(movie.tmdbId, movie.eTag ?? null),
        ),
      );

      fetchedMovies.push(...fetchedBatch);
    }

    const modifiedMovies = fetchedMovies.filter(
      (response) =>
        response?.status && (response.status as HttpStatus) === HttpStatus.OK,
    );

    const modifiedMoviesCount = modifiedMovies.length;

    this.logger.log(
      `${modifiedMoviesCount.toString()} movie(s) to be updated.`,
    );
    if (modifiedMoviesCount) {
      this.logger.debug('Clearing all cache');
      await this.cacheManager.clear();

      const processed = await Promise.allSettled(
        modifiedMovies
          .filter((batch) => !!batch)
          .map((batch) =>
            this.movieService.updateMovie(
              batch.data,
              batch.headers.etag as string,
            ),
          ),
      );
      const failed = processed.filter((p) => p.status === 'rejected');

      const total = processed.length;
      const failedCount = failed.length;
      const succeededCount = total - failedCount;

      this.logger.log(
        `${total.toString()} movie(s) processed. ${succeededCount.toString()} succeeded, ${failedCount.toString()} failed`,
      );
      this.logger.debug({ errors: failed });
    }

    this.logger.log('Movie Refresh Job Completed');
  }

  private createBatches = (arr: MovieDto[], size: number) =>
    Array.from(
      { length: Math.ceil(arr.length / size) },
      (_: MovieDto[], i: number) => arr.slice(i * size, i * size + size),
    );
}
