import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @IsString()
  @IsOptional()
  id?: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  shared?: boolean = false;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  per_page = 10;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page_number = 0;
}
