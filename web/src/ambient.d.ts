export type User = {
  username: string;
  email: string;
  id: string;
};

export type MovieType = {
  id: string;
  title: string;
  description?: string;
  genre: string[];
  releaseDate?: number;
  rating: number;
  posterUrl: string;
  watched: boolean;
};

export type ListType = {
  id: string;
  name: string;
  isPrivate: boolean;
  creatorId: number;
  creatorUsername: string | undefined;
  createdAt: string;
  updatedAt: string;
  movie: MovieType[];
  sharees?: Sharee[];
};

export type Lists = {
  list: ListType[];
};

export type TMDBMovieResult = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  genres: string[];
  vote_average: number;
};

export type Sharee = {
  username: string;
  email: string;
  creator: boolean;
  watched: MovieType[];
};
