import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryDto {
  @IsString()
  @IsOptional()
  id?: string;

  @Transform(({ value }) => {
    return value === 'true' || value === true || value === 1;
  })
  @IsBoolean()
  @IsOptional()
  shared?: boolean = false;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  per_page = 500;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page_number = 0;
}
