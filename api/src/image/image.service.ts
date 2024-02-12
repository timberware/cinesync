import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageDao } from './daos/image.dao';

@Injectable()
export class ImageService {
	constructor(private imageDao: ImageDao) {}

	async getImage(filename: string) {
		const { image } = await this.imageDao.getImage(filename);

		if (!image) {
			throw new NotFoundException('No image found');
		}

		return image;
	}

	async createImage(filename: string, image: Buffer) {
		return this.imageDao.createImage(filename, image);
	}

	async deleteImage(filename: string) {
		return await this.imageDao.deleteImage(filename);
	}
}
