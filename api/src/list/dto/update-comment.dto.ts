import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  text: string;
}
