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

  @Cron(CronExpression.EVERY_12_HOURS)
  async updateMovies() {
    this.logger.log('Movie Refresh Job Starting');

    const count = await this.movieService.getCount();
    const { movies } = await this.movieService.getMovies({
      per_page: count,
      page_number: 0,
    });

    const chunks = this.chunk(movies, this.BATCH_SIZE);
    const megaChunk = (
      await Promise.all(
        chunks.map(
          async (chunk) =>
            await Promise.all(
              chunk.map((movie) =>
                this.movieService.getTMDBMovie(movie.tmdbId, movie.eTag || ''),
              ),
            ),
        ),
      )
    ).flat();

    const preparedChunk = megaChunk.filter(
      (chunk) => chunk?.status === HttpStatus.OK,
    );

    const preparedCount = preparedChunk.length;

    this.logger.log(`${preparedCount} movie(s) to be updated.`);
    if (!preparedCount) {
      this.logger.debug('Clearing all cache');
      this.cacheManager.reset();
    }

    await Promise.all(
      preparedChunk.map((chunk) => {
        this.movieService.updateMovie(
          chunk.data as TMDBMovieDto,
          chunk.headers.etag as string,
        );
      }),
    );

    this.logger.log('Movie Refresh Job Completed');
  }

  private chunk = (arr: MovieDto[], size: number) =>
    Array.from(
      { length: Math.ceil(arr.length / size) },
      (_: MovieDto[], i: number) => arr.slice(i * size, i * size + size),
    );
}
