import { Controller, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { CurrentUser } from '../../auth/decorator/current-user.decorator';
import { UserDto } from '../dto/user.dto';

@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get()
  async exportData(@CurrentUser() user: UserDto, @Res() res: Response) {
    const userData = await this.exportService.exportUserData(user.id);

    res.set({
      'Content-Disposition': `attachment; filename=${
        user.username
      }_${new Date().toJSON()}.json`,
      'Content-Type': 'application/json',
    });

    return res.send(userData);
  }
}
