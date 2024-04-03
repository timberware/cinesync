import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from './image.service';
import { Public } from '../auth/decorator/public.decorator';

@Controller('images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Public()
  @Get('/:name')
  async getImage(@Param('name') name: string, @Res() res: Response) {
    const image = await this.imageService.getImage(name);

    res.end(image);
  }
}
