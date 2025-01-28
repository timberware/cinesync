import { MovieDto } from '../movie/dto/movie.dto';
import { TMDBMovieDto } from '../sync/dto/tmdbMovie.dto';
import {
  TMDBMovieDto as TMDBDto,
  MovieDto as Movie,
  TMDBGenreDto,
} from '../search/dto/search.dto';

export const tmdbToDao = (movie: TMDBMovieDto, eTag: string): MovieDto => {
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
};

export const tmdbMovieDtoToMovieDto = (
  tmdb: TMDBDto,
  tmdbGenres: TMDBGenreDto[],
): Movie => {
  const genres = tmdb.genre_ids.map((g) => {
    const found = tmdbGenres.find((gn) => g === gn.id);

    if (found) return found.name;
  });

  return {
    id: '',
    title: tmdb.title,
    description: tmdb.overview,
    releaseDate: tmdb.release_date,
    posterUrl: tmdb.poster_path,
    rating: tmdb.vote_average,
    tmdbId: tmdb.id,
    eTag: '',
    genre: genres.filter((g) => g !== undefined),
  };
};
