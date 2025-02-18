export type User = {
  id: string;
  username: string;
  email: string;
  watched?: string[];
};

export type MovieType = {
  id: string;
  title: string;
  description?: string;
  genre: string[];
  releaseDate: string;
  rating: number;
  posterUrl: string;
  watched: boolean;
  tmdbId: number;
};

export type Movies = {
  movies: MovieType[];
  count: number;
};

export type ListType = {
  id: string;
  name: string;
  isPrivate: boolean;
  creatorId: string;
  creatorUsername: string | undefined;
  createdAt: string;
  updatedAt: string;
  movies: number;
  sharees: number;
  posterUrl: string;
};

export type Lists = {
  lists: ListType[];
  count: number;
};

export type ToastTypes = 'info' | 'success' | 'error';

export type ToastType = {
  id?: string;
  message: string;
  type: ToastTypes;
  dismissible: boolean;
  timeout: number;
};

export type Stats = {
  id?: string;
  listCount: number;
  moviesCount: number;
  sharedListCount: number;
  commentsCount: number;
};

export type SearchResult = {
  db: MovieWithLists[];
  tmdb: MovieType[];
};

export type MovieWithLists = MovieType & { lists: ListType[] };
