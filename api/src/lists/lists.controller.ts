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
import { Request } from 'express';
import { ListsService } from './lists.service';
import { CommentsService } from './comments.service';
import { ListAuthGuard } from './guards/list.guard';
import { RemoveListFieldsInterceptor } from './interceptors/remove-list-fields.interceptor';
import { RemoveListCreateFieldsInterceptor } from './interceptors/remove-list-create-fields.interceptor';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CommentAuthorizationGuard } from '../users/guards/comment-auth.guard';
import { CloneListDto } from './dtos/clone-list.dto';
import { Public } from '../users/decorators/public.decorator';
import { ShareListAuthGuard } from './guards/share-list.guard';
import { ListPrivacyAuthGuard } from './guards/list-private.guard';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Controller('lists')
export class ListsController {
  constructor(
    private listsService: ListsService,
    private commentService: CommentsService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Public()
  @Get('/:id/public')
  getPublicList(@Param('id') listId: string) {
    return this.listsService.getPublicList(listId);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Get('/:id')
  getList(@Param('id') listId: string) {
    return this.listsService.getList(listId);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @Get('/')
  getLists(@Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listsService.getLists(req.user.id);
  }

  @Get('/movies/watched')
  getWatchedMovies(@Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listsService.getWatchedMovies(req.user.id);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Post('/')
  createList(@Body() body: CreateListDto, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listsService.createList(body, req.user.id);
  }

  @UseGuards(ListAuthGuard)
  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Post('/:id/clone')
  cloneList(
    @Param('id') listId: string,
    @Body() { name }: CloneListDto,
    @Req() req: Request,
  ) {
    console.log({ listId });
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listsService.cloneList({ name, listId }, req.user.id);
  }

  @UseGuards(ListAuthGuard)
  @Get('/:id/sharees')
  getSharees(@Param('id') listId: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listsService.getSharees(listId, req.user.id);
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
    return this.listsService.toggleShareByUsername(
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
    return this.listsService.toggleShareList(listId, shareeEmail, req.user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Post('/:id/comments')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createComment(
    @Param('id') listId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    if (!req.user) throw new BadRequestException('req contains no user');

    const { id: userId } = req.user;
    const comment = await this.commentService.createComment(
      createCommentDto,
      listId,
      userId,
    );

    const list = await this.listsService.getList(listId);
    const [listOwner, commenter] = await Promise.all([
      this.usersService.getUser(list.creatorId),
      this.usersService.getUser(userId),
    ]);

    if (list.creatorId !== commenter.id) {
      await this.emailService.sendListCommentEmail(
        listOwner.email,
        list,
        commenter.username,
      );
    }

    return comment;
  }

  @UseGuards(ListAuthGuard, CommentAuthorizationGuard)
  @Patch('/:id/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
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
  @Patch('/:id/updatePrivacy')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateListPrivacy(@Param('id') listId: string) {
    return this.listsService.updateListPrivacy(listId);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Patch('/:id')
  updateList(@Body() body: UpdateListDto) {
    return this.listsService.updateList(body);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @Patch('/movies/:id/updateWatchedStatus')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateWatchedStatus(@Param('id') movieId: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listsService.updateWatchedStatus(movieId, req.user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteList(@Param('id') listId: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listsService.deleteList(listId, req.user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Delete('/:id/movies/:movieId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMovie(
    @Param('id') listId: string,
    @Param('movieId') movieId: string,
    @Req() req: Request,
  ) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.listsService.deleteListItem(listId, movieId);
  }
}
