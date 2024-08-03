import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImageDao {
  constructor(private readonly prisma: PrismaService) {}

  getImage(username: string) {
    return this.prisma.image.findUniqueOrThrow({
      where: {
        name: username,
      },
    });
  }

  createImage(username: string, mimetype: string, image: Buffer) {
    return this.prisma.image.upsert({
      where: {
        name: username,
      },
      update: {
        mimetype,
        image,
      },
      create: { name: username, image, mimetype },
    });
  }

  deleteImage(username: string) {
    this.prisma.image.delete({
      where: {
        name: username,
      },
    });
  }
}
