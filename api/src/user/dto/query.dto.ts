import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  per_page = 500;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page_number = 0;
}
