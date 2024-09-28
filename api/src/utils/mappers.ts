import { MovieDto } from '../movie/dto/movie.dto';
import { TMDBMovieDto } from '../sync/dto/tmdbMovie.dto';

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
