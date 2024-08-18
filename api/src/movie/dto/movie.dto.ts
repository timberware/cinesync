import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class MovieDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genre: string[];

  @IsString()
  @IsOptional()
  releaseDate: string;

  @IsString()
  @IsOptional()
  posterUrl: string;

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsNumber()
  @IsOptional()
  tmdbId: number;

  @IsString()
  @IsOptional()
  eTag?: string | null;
}
