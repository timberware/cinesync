import { Type } from 'class-transformer';
import { IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';

class Genre {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class TMDBMovieDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  overview: string;

  @IsArray()
  @Type(() => Genre)
  @ValidateNested()
  genres: Genre[];

  @IsString()
  release_date: string;

  @IsNumber()
  vote_average: number;

  @IsString()
  poster_path: string;
}
