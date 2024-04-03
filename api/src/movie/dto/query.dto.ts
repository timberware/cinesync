import { IsString, IsOptional } from 'class-validator';

export class QueryDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  listId?: string;
}
