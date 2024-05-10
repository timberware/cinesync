import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class ListItem {
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
}

export class ListDto {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => ListItem)
  @ValidateNested()
  list: ListItem[];
}
