import {
  Controller,
  Body,
  Get,
  Post,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypes } from '../notification/templates';
import { AuthService } from './auth.service';
import { AdminGuard } from './guard/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RemoveFieldsInterceptor } from './interceptor/remove-fields.interceptor';
import { CurrentUser } from './decorator/current-user.decorator';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: UserDto) {
    return user;
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);
    this.notificationService.send(
      { toEmail: body.email, toUsername: body.username },
      NotificationTypes.SIGN_UP,
    );
    return user;
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(
    @CurrentUser() user: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.authService.login(user, response);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/delete')
  async deleteUser(@CurrentUser() user: UserDto) {
    await this.authService.deleteUser(user.id);
    this.notificationService.send(
      { toEmail: user.email, toUsername: '' },
      NotificationTypes.ACCOUNT_DELETED,
    );
  }
}
