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
  toEmail: string;

  @Expose()
  @IsString()
  toUsername: string;

  @Expose()
  @IsString()
  @IsOptional()
  ccEmail?: string;

  @Expose()
  @IsString()
  @IsOptional()
  ccUsername?: string;

  @Expose()
  @IsString()
  @IsOptional()
  commenter?: string;
}
