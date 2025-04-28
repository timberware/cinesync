import { List, ListUser } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class ListItem {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  isPrivate: boolean;

  @Expose()
  creatorId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  lastVisited?: Date;
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

export type ListDTO = List & { listUser?: ListUser[] };
