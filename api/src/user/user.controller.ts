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
  UseInterceptors,
  Patch,
  Param,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AdminGuard } from '../auth/guard/admin.guard';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveFieldsInterceptor } from './interceptor/remove-fields.interceptor';
import { FriendStatus } from './user.service';
import { ImageService } from '../image/image.service';

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

@Controller('user')
export class UserController {
  constructor(
    private usersService: UserService,
    private authService: AuthService,
    private imageService: ImageService,
  ) {}

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

  @Get('/friends')
  async getFriends(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('user not found');
    return this.usersService.getFriends(req.user.id);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Post('/friends/send')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendFriendRequest(
    @Req() req: Request,
    @Body() { username }: { username: string },
  ) {
    if (!req.user) throw new UnauthorizedException('user not found');
    return await this.usersService.sendFriendRequest(req.user.id, username);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Post('/friends/update')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateFriendRequest(
    @Req() req: Request,
    @Body() { username, status }: { username: string; status: FriendStatus },
  ) {
    if (!req.user) throw new UnauthorizedException('user not found');
    return await this.usersService.updateFriendship(
      req.user.id,
      username,
      status,
    );
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @Patch('/update')
  async updateUser(@Req() req: Request, @Body() body: UpdateUserDto) {
    if (!req.user) throw new UnauthorizedException('user not found');

    if (body?.password) {
      body.password = await this.authService.hash(body.password);
    }

    return this.usersService.updateUser(req.user.id, body);
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
    if (!req.user) throw new UnauthorizedException('user not found');

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
    if (!req.user) throw new UnauthorizedException('user not found');
    return this.imageService.deleteImage(req.user?.username);
  }
}
