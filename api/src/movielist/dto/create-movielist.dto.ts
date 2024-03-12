import { IsArray, IsOptional, IsString } from 'class-validator';
import { MovieDto } from '../../movie/dto/movie.dto';

export class CreateMovieListDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  movie: MovieDto[];
}
