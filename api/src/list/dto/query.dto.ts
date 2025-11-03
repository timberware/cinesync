import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseQueryDto } from 'src/common/dto/baseQuery.dto';

export class QueryDto extends BaseQueryDto {
  @IsString()
  @IsOptional()
  id?: string;

  @Transform(({ value }) => {
    return value === 'true' || value === true || value === 1;
  })
  @IsBoolean()
  @IsOptional()
  shared?: boolean = false;
}
