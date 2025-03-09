import { Injectable } from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { ListItem, MovieDto } from './dto/search.dto';
import { MovieDao } from './dao/movie.dao';
import { TMDBDao } from './dao/tmdb.dao';
import { tmdbMovieDtoToMovieDto } from '../utils/mappers';

@Injectable()
export class SearchService {
  constructor(
    private readonly prismaDao: MovieDao,
    private readonly tmdbDao: TMDBDao,
  ) {}

  async get(query: QueryDto) {
    const movies = (await this.prismaDao.search(query)) as
      | (MovieDto & { listMovie?: { List: ListItem }[] })[]
      | undefined;

    const [tmdbRes, genres] = await Promise.all([
      this.tmdbDao.search(query.search),
      this.tmdbDao.getGenres(),
    ]);

    const dbRes = movies?.map((m) => {
      const { listMovie, ...movie } = m;

      return {
        ...movie,
        lists: listMovie?.map((l) => l.List) ?? [],
      };
    });

    return {
      db: dbRes ?? [],
      tmdb: tmdbRes.data.results.map((tmdb) =>
        tmdbMovieDtoToMovieDto(tmdb, genres.data.genres),
      ),
    };
  }
}
