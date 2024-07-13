import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class QueryDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  listId?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  per_page? = 500;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page_number? = 0;
}
