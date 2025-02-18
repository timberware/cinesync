import { Expose } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CommentDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  userId: string;

  @Expose()
  @IsString()
  text: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}

export class CommentQueryDto {
  @Expose()
  @IsString()
  @IsOptional()
  commentId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  listId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  userId?: string;
}
