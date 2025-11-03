import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class BaseQueryDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  per_page? = 20;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page_number? = 0;

  @IsString()
  @IsOptional()
  search?: string;
}
