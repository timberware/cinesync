import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserDto } from '../../users/dtos/user.dto';
import { CommentDto } from '../../comment/dto';

export class List {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  isPrivate: boolean;

  @Expose()
  creatorId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserDto)
  @ValidateNested()
  user: UserDto[];

  @Expose()
  @Type(() => CommentDto)
  @ValidateNested()
  comments: CommentDto[];
}

export class CreateListReturn {
  @Expose()
  @Type(() => List)
  @ValidateNested()
  list: List;
}
