import { IsString } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/baseQuery.dto';

export class QueryDto extends BaseQueryDto {
  @IsString()
  search: string;
}
