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
import { ListsService } from './list.service';
import { CommentsService } from './comment.service';
import { ListAuthGuard } from './guard/list.guard';
import { RemoveListFieldsInterceptor } from './interceptor/remove-list-fields.interceptor';
import { RemoveListCreateFieldsInterceptor } from './interceptor/remove-list-create-fields.interceptor';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentAuthorizationGuard } from '../users/guards/comment-auth.guard';
import { CloneListDto } from './dto/clone-list.dto';
import { Public } from '../users/decorators/public.decorator';
import { ShareListAuthGuard } from './guard/share-list.guard';
import { ListPrivacyAuthGuard } from './guard/list-private.guard';
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
