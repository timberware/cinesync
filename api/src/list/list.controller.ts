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
  Param,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { CreateListDto, UpdateListDto } from './dto';
import { CommentAuthorizationGuard } from '../comment/guard/comment-auth.guard';
import { Request } from 'express';
import { ListService } from './list.service';
import { CommentsService } from '../comment/comment.service';
import { ListAuthGuard } from './guard/list.guard';
import { RemoveListFieldsInterceptor } from './interceptor/remove-list-fields.interceptor';
import { RemoveListCreateFieldsInterceptor } from './interceptor/remove-list-create-fields.interceptor';
import { Public } from '../auth/decorator/public.decorator';
import { ShareListAuthGuard } from './guard/share-list.guard';
import { ListPrivacyAuthGuard } from './guard/list-private.guard';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypes } from '../notification/templates';
import { QueryDto } from './dto/query.dto';

@Controller('lists')
export class ListController {
  constructor(
    private listService: ListService,
    private commentService: CommentsService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  @UseInterceptors(RemoveListFieldsInterceptor)
  @Get('/')
  getLists(@Query() query: QueryDto) {
    return this.listService.getLists(query);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Public()
  @Get('/:id/public')
  getPublicList(@Param('id') listId: string) {
    return this.listService.getPublicList(listId);
  }

  @UseGuards(ListAuthGuard)
  @Get('/:id')
  getList(@Param('id') listId: string) {
    return this.listService.getList(listId);
  }

  @UseGuards(ListAuthGuard)
  @Get('/:id/sharees')
  getSharees(@Param('id') listId: string, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('user not found');
    return this.listService.getSharees(listId, req.user.id);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Post('/')
  createList(@Body() { name }: CreateListDto, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('user not found');
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
    if (!req.user) throw new UnauthorizedException('user not found');
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
    if (!req.user) throw new UnauthorizedException('user not found');
    return this.listService.toggleShareList(listId, shareeEmail, req.user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Post('/:id/comments')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createComment(
    @Param('id') listId: string,
    @Body() { text }: { text: string },
    @Req() req: Request,
  ) {
    if (!req.user) throw new UnauthorizedException('user not found');

    const { id: userId } = req.user;
    const createdComment = await this.commentService.createComment(
      text,
      listId,
      userId,
    );

    const list = await this.listService.getList(listId);
    const [listOwner, commenter] = await Promise.all([
      this.userService.getUser(list.creatorId),
      this.userService.getUser(userId),
    ]);

    if (list.creatorId !== commenter.id) {
      await this.notificationService.send(
        {
          toEmail: listOwner.email,
          toUsername: listOwner.username,
          listName: list.name,
          listId: list.id,
          commenter: commenter.username,
        },
        NotificationTypes.COMMENT,
      );
    }

    return createdComment;
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
    if (!req.user) throw new UnauthorizedException('user not found');
    return this.listService.deleteList(listId, req.user.id);
  }
}
