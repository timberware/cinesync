import {
  Controller,
  Query,
  Body,
  Get,
  Post,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
  UseInterceptors,
  Patch,
  Param,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotificationService } from '../notification/notification.service';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { AdminGuard } from './guards/admin.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RemoveFieldsInterceptor } from './interceptors/remove-fields.interceptor';
import { FriendStatus } from './users.service';
import { Public } from './decorators/public.decorator';
import { ImageService } from '../image/image.service';
import { NotificationTypes } from '../notification/templates';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
      role: Role;
      avatarName: string;
    }
  }
}

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private imageService: ImageService,
  ) {}

  @UseInterceptors(RemoveFieldsInterceptor)
  @Get('/whoami')
  whoAmI(@Req() req: Request) {
    return req.user;
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Get('/:id')
  fetchUserById(@Param('id') userId: string) {
    return this.usersService.getUser(userId);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Get('/username')
  fetchUserByUsername(@Query('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Get('/email')
  fetchUserByEmail(@Query('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Public()
  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);
    await this.notificationService.send(
      { userEmail: body.email, username: body.username },
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
    if (!req.user) throw new BadRequestException('req contains no user');
    const user = await this.authService.login(req.user);
    return user;
  }

  @Get('/friends')
  async getFriends(@Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.usersService.getFriends(req.user.id);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Post('/friends/send')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendFriendRequest(
    @Req() req: Request,
    @Body() { username }: { username: string },
  ) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return await this.usersService.sendFriendRequest(req.user.id, username);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Post('/friends/update')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateFriendRequest(
    @Req() req: Request,
    @Body() { username, status }: { username: string; status: FriendStatus },
  ) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return await this.usersService.updateFriendship(
      req.user.id,
      username,
      status,
    );
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Patch('/update')
  async updateUser(@Req() req: Request, @Body() body: UpdateUserDto) {
    if (!req.user) throw new BadRequestException('req contains no user');

    if (body?.password) {
      body.password = await this.authService.encrypt(body.password);
    }

    return this.usersService.updateUser(req.user.id, body);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/delete')
  async deleteUser(@Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');

    await this.usersService.deleteUser(req.user.id);
    await this.notificationService.send(
      { userEmail: req.user.email },
      NotificationTypes.ACCOUNT_DELETED,
    );
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('image'))
  async createAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!req.user) throw new BadRequestException('req contains no user');

    const extension = file.originalname
      .split('.')
      .slice(-1) as unknown as string;
    const { username } = req.user;
    const avatarName = `${username}.${extension}`;

    if (req.user.avatarName) {
      this.imageService.deleteImage(req.user.avatarName);
    }

    this.usersService.updateUser(req.user.id, { avatarName });

    return this.imageService.createImage(avatarName, file?.buffer);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/avatar')
  async deleteAvatar(@Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.imageService.deleteImage(req.user?.username);
  }
}
