import {
  Controller,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SyncService } from './sync.service';
import { UserDto } from 'src/user/dto/user.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('sync')
export class SyncController {
  private logger = new Logger(SyncController.name);

  constructor(private syncService: SyncService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  syncMovies(@CurrentUser() user: UserDto) {
    this.logger.log(user);

    return this.syncService.updateMovies();
  }
}
