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
  UseInterceptors,
  Patch,
  Param,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AdminGuard } from '../auth/guard/admin.guard';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from './dto/query.dto';
import { RemoveFieldsInterceptor } from './interceptor/remove-fields.interceptor';
import { FriendStatus } from './user.service';
import { ImageService } from '../image/image.service';
import { AVATAR_MAX_SIZE } from '../utils';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private imageService: ImageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getUsers(@Query() query: QueryDto) {
    return this.userService.getUsers(query);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Get('/:id/stats')
  @UseGuards(JwtAuthGuard)
  getUserStats(@Param('id') userId: string) {
    return this.userService.getUserStats(userId);
  }

  @Get('/friends')
  @UseGuards(JwtAuthGuard)
  getFriends(@CurrentUser() user: UserDto) {
    return this.userService.getFriends(user.id);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/friends/send')
  @HttpCode(HttpStatus.NO_CONTENT)
  sendFriendRequest(
    @Body() { username }: { username: string },
    @CurrentUser() user: UserDto,
  ) {
    return this.userService.sendFriendRequest(user.id, username);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/friends/update')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateFriendRequest(
    @Body() { username, status }: { username: string; status: FriendStatus },
    @CurrentUser() user: UserDto,
  ) {
    return this.userService.updateFriendship(user.id, username, status);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async updateUser(@Body() body: UpdateUserDto, @CurrentUser() user: UserDto) {
    if (body.password) {
      body.password = await this.authService.hash(body.password);
    }

    return this.userService.updateUser(user.id, body);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('image'))
  async createAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: AVATAR_MAX_SIZE }),
          new FileTypeValidator({ fileType: '.(png|jpeg|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: UserDto,
  ) {
    const { mimetype } = file;

    return this.imageService.createImage(user.username, mimetype, file.buffer);
  }

  @UseInterceptors(RemoveFieldsInterceptor)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/avatar')
  deleteAvatar(@CurrentUser() user: UserDto) {
    this.imageService.deleteImage(user.username);
  }
}
