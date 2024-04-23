import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  per_page = 10;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page_number = 0;
}
