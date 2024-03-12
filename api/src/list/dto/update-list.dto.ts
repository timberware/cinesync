import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateListDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
