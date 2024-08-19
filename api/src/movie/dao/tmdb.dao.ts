import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TMDBDao {
  private TMDB_TOKEN: string | undefined;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.TMDB_TOKEN = this.configService.get<string>('TMDB_TOKEN');

    if (!this.TMDB_TOKEN)
      throw new InternalServerErrorException('Env var TMDB_TOKEN is missing');
  }

  async getTMDBMovie(tmdbId: number, eTag: string) {
    const URL = this.GetTMDBUrl(tmdbId);

    const response = this.httpService.get(URL, {
      headers: {
        Authorization: `Bearer ${this.TMDB_TOKEN}`,
        accept: 'application/json',
        'If-None-Match': eTag,
      },
    });

    return await lastValueFrom(response);
  }

  private GetTMDBUrl(tmdbId: number) {
    return `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`;
  }
}
