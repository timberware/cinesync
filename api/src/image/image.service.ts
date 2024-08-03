import { Injectable } from '@nestjs/common';
import { ImageDao } from './daos/image.dao';

@Injectable()
export class ImageService {
  constructor(private imageDao: ImageDao) {}

  async getImage(username: string) {
    return this.imageDao.getImage(username);
  }

  async createImage(username: string, mimetype: string, image: Buffer) {
    return this.imageDao.createImage(username, mimetype, image);
  }

  async deleteImage(username: string) {
    return this.imageDao.deleteImage(username);
  }
}
