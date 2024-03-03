import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { CreateListDto, UpdateListDto } from './dto';
import { CommentAuthorizationGuard } from '../comment/guard/comment-auth.guard';
import { Request } from 'express';
import { ListService } from './list.service';
import { CommentsService } from '../comment/comment.service';
import { ListAuthGuard } from './guard/list.guard';
import { RemoveListFieldsInterceptor } from './interceptor/remove-list-fields.interceptor';
import { RemoveListCreateFieldsInterceptor } from './interceptor/remove-list-create-fields.interceptor';
import { Public } from '../users/decorators/public.decorator';
import { ShareListAuthGuard } from './guard/share-list.guard';
import { ListPrivacyAuthGuard } from './guard/list-private.guard';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypes } from '../notification/templates';

@Controller('lists')
export class ListController {
  constructor(
    private listService: ListService,
    private commentService: CommentsService,
    private usersService: UsersService,
    private notificationService: NotificationService,
  ) {}

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Public()
  @Get('/:id/public')
  getPublicList(@Param('id') listId: string) {
    return this.listService.getPublicList(listId);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Get('/:id')
  getList(@Param('id') listId: string) {
    return this.listService.getList(listId);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @Get('/')
  getLists(@Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listService.getLists(req.user.id);
  }

  @UseGuards(ListAuthGuard)
  @Get('/:id/sharees')
  getSharees(@Param('id') listId: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listService.getSharees(listId, req.user.id);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Post('/')
  createList(@Body() { name }: CreateListDto, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listService.createList(name, req.user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard, ShareListAuthGuard)
  @Post('/:id/toggleShareByUsername')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleShareListByUsername(
    @Param('id') listId: string,
    @Body() { username }: { username: string },
    @Req() req: Request,
  ) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listService.toggleShareByUsername(
      listId,
      username,
      req.user.id,
    );
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard, ShareListAuthGuard)
  @Post('/:id/toggleShare')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleShareList(
    @Param('id') listId: string,
    @Body() { email: shareeEmail }: { email: string },
    @Req() req: Request,
  ) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listService.toggleShareList(listId, shareeEmail, req.user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Post('/:id/comments')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createComment(
    @Param('id') listId: string,
    @Body() createCommentDto: string,
    @Req() req: Request,
  ) {
    if (!req.user) throw new BadRequestException('req contains no user');

    const { id: userId } = req.user;
    const comment = await this.commentService.createComment(
      createCommentDto,
      listId,
      userId,
    );

    const list = await this.listService.getList(listId);
    const [listOwner, commenter] = await Promise.all([
      this.usersService.getUser(list.creatorId),
      this.usersService.getUser(userId),
    ]);

    if (list.creatorId !== commenter.id) {
      await this.notificationService.send(
        {
          userEmail: listOwner.email,
          username: listOwner.username,
          listName: list.name,
          listId: list.id,
          commenter: commenter.username,
        },
        NotificationTypes.COMMENT,
      );
    }

    return comment;
  }

  @UseGuards(ListAuthGuard, CommentAuthorizationGuard)
  @Patch('/:id/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: string,
  ) {
    return this.commentService.updateComment(updateCommentDto, commentId);
  }

  @UseGuards(ListAuthGuard, CommentAuthorizationGuard)
  @Delete('/:id/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard, ListPrivacyAuthGuard)
  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateList(
    @Param('id') listId: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listService.updateList(listId, updateListDto);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteList(@Param('id') listId: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listService.deleteList(listId, req.user.id);
  }
}
