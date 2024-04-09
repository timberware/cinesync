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
  releaseDate?: number;
  rating: number;
  posterUrl: string;
  watched: boolean;
};

export type ListType = {
  id: string;
  name: string;
  isPrivate: boolean;
  creatorId: string;
  creatorUsername: string | undefined;
  createdAt: string;
  updatedAt: string;
  movie: MovieType[];
  sharees?: User[];
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
