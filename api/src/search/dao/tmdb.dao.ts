import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { getSearchTMDBUrl } from '../../utils';
import { TMDBMovieDto } from '../dto/search.dto';

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

  async search(search: string) {
    const URL = getSearchTMDBUrl(search);

    const response = this.httpService.get<{ results: TMDBMovieDto[] }>(URL, {
      headers: {
        Authorization: `Bearer ${this.TMDB_TOKEN}`,
        accept: 'application/json',
      },
    });

    return await lastValueFrom(response);
  }
}
