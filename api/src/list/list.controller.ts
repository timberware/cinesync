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
  Param,
  Query,
} from '@nestjs/common';
import { CreateListDto, UpdateListDto } from './dto';
import { CommentAuthorizationGuard } from '../comment/guard/comment-auth.guard';
import { ListService } from './list.service';
import { CommentsService } from '../comment/comment.service';
import { MovieService } from '../movie/movie.service';
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
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UserDto } from './dto/sharee.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('lists')
export class ListController {
  constructor(
    private listService: ListService,
    private movieService: MovieService,
    private commentService: CommentsService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getList(@Param('id') listId: string) {
    return this.listService.getList(listId);
  }

  @UseGuards(ListAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/:id/sharees')
  getSharees(@Param('id') listId: string, @CurrentUser() user: UserDto) {
    return this.listService.getSharees(listId, user.id);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/')
  createList(@Body() { name }: CreateListDto, @CurrentUser() user: UserDto) {
    return this.listService.createList(name, user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(JwtAuthGuard, ListAuthGuard, ShareListAuthGuard)
  @Post('/:id/toggleShareByUsername')
  @HttpCode(HttpStatus.NO_CONTENT)
  toggleShareListByUsername(
    @Param('id') listId: string,
    @Body() { username }: { username: string },
    @CurrentUser() user: UserDto,
  ) {
    return this.listService.toggleShareByUsername(listId, username, user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(JwtAuthGuard, ListAuthGuard, ShareListAuthGuard)
  @Post('/:id/toggleShare')
  @HttpCode(HttpStatus.NO_CONTENT)
  toggleShareList(
    @Param('id') listId: string,
    @Body() { email: shareeEmail }: { email: string },
    @CurrentUser() user: UserDto,
  ) {
    return this.listService.toggleShareList(listId, shareeEmail, user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(JwtAuthGuard, ListAuthGuard)
  @Post('/:id/comments')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createComment(
    @Param('id') listId: string,
    @Body() { text }: { text: string },
    @CurrentUser() user: UserDto,
  ) {
    const createdComment = await this.commentService.create(
      text,
      listId,
      user.id,
    );

    const list = await this.listService.getList(listId);
    const [listOwner, commenter] = await Promise.all([
      this.userService.getUser(list.creatorId),
      this.userService.getUser(user.id),
    ]);

    if (list.creatorId !== commenter.id) {
      this.notificationService.send(
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

  @UseGuards(JwtAuthGuard, ListAuthGuard)
  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Post('/:id/clone')
  async cloneList(
    @Param('id') listId: string,
    @Body() { name }: { name: string },
    @CurrentUser() user: UserDto,
  ) {
    const { count } = await this.movieService.getMovies({ listId });
    const originalList = await this.getList(listId);
    const clonedList = await this.listService.createList(
      name || originalList.name,
      user.id,
    );

    if (count === 0) {
      return clonedList;
    }

    const { movies } = await this.movieService.getMovies({
      per_page: count,
      page_number: 0,
      listId,
    });

    await this.movieService.createMovies(movies, clonedList.id);

    return clonedList;
  }

  @UseGuards(JwtAuthGuard, ListAuthGuard, CommentAuthorizationGuard)
  @Patch('/:id/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateComment(
    @Param('commentId') commentId: string,
    @Param('id') listId: string,
    @Body() updateCommentDto: string,
  ) {
    return this.commentService.update(updateCommentDto, commentId, listId);
  }

  @UseGuards(JwtAuthGuard, ListAuthGuard, CommentAuthorizationGuard)
  @Delete('/:id/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(
    @Param('commentId') commentId: string,
    @Param('id') listId: string,
  ) {
    return this.commentService.delete(commentId, listId);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(JwtAuthGuard, ListAuthGuard, ListPrivacyAuthGuard)
  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateList(
    @Param('id') listId: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listService.updateList(listId, updateListDto);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(JwtAuthGuard, ListAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteList(@Param('id') listId: string, @CurrentUser() user: UserDto) {
    return this.listService.deleteList(listId, user.id);
  }
}
