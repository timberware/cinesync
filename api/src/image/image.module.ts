import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageDao } from './daos/image.dao';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImageController],
  providers: [ImageDao, ImageService],
})
export class ImageModule {}
