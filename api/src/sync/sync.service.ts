import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TMDBMovieDto } from './dto/tmdbMovie.dto';
import { MovieService } from '../movie/movie.service';
import { MovieDto } from '../movie/dto/movie.dto';

@Injectable()
export class SyncService {
  private logger = new Logger(SyncService.name);

  constructor(private movieService: MovieService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateMoviesRating() {
    this.logger.log('Start Movie Refresh Job');

    const batchSize = 50;

    const { movies } = await this.movieService.getMovies({});

    const chunks = this.chunk(movies, batchSize);

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
      (chunk) => chunk.status === HttpStatus.OK,
    );

    await Promise.all(
      preparedChunk.map((chunk) => {
        this.movieService.updateMovie(
          chunk.data as TMDBMovieDto,
          chunk.headers.etag as string,
        );
      }),
    );

    this.logger.log('Finished Movie Refresh Job');
  }

  private chunk = (arr: MovieDto[], size: number) =>
    Array.from(
      { length: Math.ceil(arr.length / size) },
      (_: MovieDto[], i: number) => arr.slice(i * size, i * size + size),
    );
}
