import { Injectable } from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { ListItem, MovieDto } from './dto/search.dto';
import { MovieDao } from './dao/movie.dao';
import { TMDBDao } from './dao/tmdb.dao';

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

    const tmdbResults = await this.tmdbDao.search(query.search);

    const dbSearchResult = movies?.map((m) => {
      const { listMovie, ...movie } = m;

      return {
        ...movie,
        lists: listMovie?.map((l) => l.List) ?? [],
      };
    });

    return {
      db: dbSearchResult ?? [],
      tmdb: tmdbResults.data.results.map(
        ({ id, title, overview, release_date, vote_average, poster_path }) => ({
          id,
          title,
          overview,
          release_date,
          vote_average,
          poster_path,
        }),
      ),
    };
  }
}
