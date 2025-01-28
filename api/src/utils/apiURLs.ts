export const getSearchTMDBUrl = (search: string) =>
  `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&include_video=false&language=en-US&page=1`;

export const getTMDBUrl = (tmdbId: number) =>
  `https://api.themoviedb.org/3/movie/${tmdbId.toString()}?language=en-US`;

export const getTMDBGenresUrl =
  'https://api.themoviedb.org/3/genre/movie/list?language=en';
