import { IsString, IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/baseQuery.dto';

export class QueryDto extends BaseQueryDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  listId?: string;
}
