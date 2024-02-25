import { Controller, Get, Param, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { RemoveFieldsInterceptor } from '../users/interceptors/remove-fields.interceptor';
import { ImageService } from './image.service';
import { Public } from '../users/decorators/public.decorator';

@Controller('images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Public()
  @UseInterceptors(RemoveFieldsInterceptor)
  @Get('/:name')
  async getImage(@Param('name') name: string, @Res() res: Response) {
    const image = await this.imageService.getImage(name);

    res.end(image);
  }
}
