import {
  Controller,
  Body,
  Get,
  Post,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypes } from '../notification/templates';
import { AuthService } from './auth.service';
import { AdminGuard } from './guard/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RemoveFieldsInterceptor } from './interceptor/remove-fields.interceptor';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  @UseInterceptors(RemoveFieldsInterceptor)
  @Get('/whoami')
  whoAmI(@Req() req: Request) {
    return req.user;
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Public()
  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);
    await this.notificationService.send(
      { toEmail: body.email, toUsername: body.username },
      NotificationTypes.SIGN_UP,
    );
    return user;
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async signin(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('req contains no user');
    const user = await this.authService.login(req.user);
    return user;
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/delete')
  async deleteUser(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('user not found');

    await this.authService.deleteUser(req.user.id);
    await this.notificationService.send(
      { toEmail: req.user.email, toUsername: '' },
      NotificationTypes.ACCOUNT_DELETED,
    );
  }
}
