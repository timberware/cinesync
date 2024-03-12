import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { MovieDto } from './movie.dto';

export class UpdateMovieListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MovieDto)
  movie: MovieDto[];
}
