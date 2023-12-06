export const GENRES = 'https://api.themoviedb.org/3/genre/movie/list?language=en';

export const searchMovieUrl = (movie: string) =>
  `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

export const getPosterUrl = (posterUrl: string) =>
  `https://image.tmdb.org/t/p/w500${posterUrl}`;

export const CINESYNC_REPO = 'https://github.com/funnls/cinesync';
export const THE_MOVIE_DB = 'https://www.themoviedb.org/';
export const THE_MOVIE_DB_AVATAR =
  'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg';
export const THE_MOVIE_DB_BIG_AVATAR =
  'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg';

export const SVELTE_KIT_UTL = 'https://kit.svelte.dev/';
export const NESTJS_URL = 'https://nestjs.com/';
