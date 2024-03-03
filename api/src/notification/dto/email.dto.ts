import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class EmailDto {
  @Expose()
  @IsString()
  from: string;

  @Expose()
  @IsString()
  to: string;

  @Expose()
  @IsString()
  @IsOptional()
  cc?: string;

  @Expose()
  @IsString()
  subject: string;

  @Expose()
  @IsString()
  html: string;
}

export class RecipientsDto {
  @Expose()
  @IsString()
  @IsOptional()
  listId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  listName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  userEmail?: string;

  @Expose()
  @IsString()
  @IsOptional()
  username?: string;

  @Expose()
  @IsString()
  @IsOptional()
  shareeEmail?: string;

  @Expose()
  @IsString()
  @IsOptional()
  shareename?: string;

  @Expose()
  @IsString()
  @IsOptional()
  commenter?: string;
}
