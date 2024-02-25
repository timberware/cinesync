import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImageDao {
  constructor(private readonly prisma: PrismaService) {}

  getImage(filename: string) {
    return this.prisma.image.findUniqueOrThrow({
      where: {
        name: filename,
      },
    });
  }

  createImage(filename: string, image: Buffer) {
    return this.prisma.image.create({
      data: { name: filename, image },
    });
  }

  async deleteImage(filename: string) {
    return await this.prisma.image.delete({
      where: {
        name: filename,
      },
    });
  }
}
