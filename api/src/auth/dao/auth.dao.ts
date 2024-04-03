import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthDao {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUser: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...createUser,
        id: uuidv4(),
        role: Role.USER,
      },
    });
  }

  async deleteUser(userId: string) {
    return await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async getUser(userEmail: string) {
    return await this.prisma.user.findUnique({
      where: { email: userEmail },
    });
  }
}
