import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

export class MovieDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @IsString()
  releaseDate: string;

  @IsString()
  posterUrl: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  tmdbId: number;

  @IsString()
  eTag: string | null;
}

export class ListItem {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  isPrivate: boolean;

  @IsString()
  creatorId: string;

  createdAt: Date;

  updatedAt: Date;
}

export class DbResults extends MovieDto {
  @IsArray()
  @Type(() => ListItem)
  @ValidateNested()
  lists: ListItem[];
}

export class TMDBMovieDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  overview: string;

  @IsString()
  release_date: string;

  @IsNumber()
  vote_average: number;

  @IsString()
  poster_path: string;

  @IsArray()
  @IsNumber()
  genre_ids: number[];
}

export class SearchResultDto {
  @IsArray()
  @Type(() => DbResults)
  @ValidateNested()
  db: DbResults[];

  @IsArray()
  @Type(() => TMDBMovieDto)
  @ValidateNested()
  tmdb: TMDBMovieDto[];
}

export class TMDBGenreDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
