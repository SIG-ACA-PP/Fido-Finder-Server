import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { PaginationQueryDto, UUID } from 'src/utils/dto';
import { Point } from 'src/models';
import { CreatePost, DeleteSeenReport, UpdatePost } from './dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private notificationsService: NotificationsService,
  ) { }

  /**
   * Returns an array with all the posts in the database. Pagination is possible
   * @returns Posts[]
   */
  @ApiOkResponse({
    description: "Returns an array with all the posts in the database. Pagination is possible",
    type: PostDto,
    isArray: true

  })
  @Get('')
  findPosts(@Query() paginationQuery: PaginationQueryDto) {
    const { take = 10, skip = 0 } = paginationQuery;
    return this.postService.findAll(take, skip);
  }

  /**
   * Returns an array with all the posts in the database.  User must be authenticated
   * @returns Posts[]
   */
  @ApiOkResponse({
    description: "Returns an array with all the posts belonging to the actual user in the database. User must be authenticated",
    type: PostDto,
    isArray: true

  })
  @UseGuards(JwtGuard)
  @Get('/own')
  findPostsByUser(@GetUser('id') userId: string) {
    return this.postService.findAllByUser(userId);
  }

  /**
  * Returns all the post based on actual location
  *
  */
  @ApiOkResponse({
    description: "All posts nearby provided location", 
    type: object, 
    isArray:true
  })
  @Post('/around-me')
  findPostsAroundMe(@Body() point: Point) {
    return this.postService.findPostsNearPoint(point);
  }

  /**
   * Get a single post based on it's id
   * @param userId 
   * @returns 
   */
  @ApiOkResponse({
    description: "Returns a single pet.",
    type: PostDto,
    isArray: false

  })

  @Get(':id')
  findPostById(@Param() params: UUID) {
    return this.postService.findOneById(params.id);
  }


  /**
   *Returns an array with all the reports about possible sightings of a lost pet. 
   * @returns Post
   */

  @ApiOkResponse({
    description: "array with all the reports about possible sightings of a lost pet",
    type: PostDto,
    isArray: true

  })
  @Get(':id/seen-reports')
  findPostSeenReports(@Param() params: UUID) {
    return this.postService.findPostSeenReports(params.id);
  }

  /**
   * Creates a new report about a possible sightings of a lost pet. User must be authenticated
   * @returns Post
   */
  @ApiBody({
    description: "DTO with the information of the pet's sighting",
    type: CreatePost
  })
  @ApiOkResponse({
    description: "Data of the newly created Sighting post",
    type: PostDto,
    isArray: false

  })
  @UseGuards(JwtGuard)
  @Post(':id/seen-reports')
  createPostSeenReport(@Param() params: UUID, @Body() dto: Point) {
    return this.postService.createPostSeenReport(params.id, dto);
  }

  /**
   * Deletes the provided report about a possible sightings of a lost pet, based on the given ID. User must be authenticated
   * @returns Post
   */
  @ApiBody({
    description: "DTO with the information of the pet's sighting post to delete",
    type: DeleteSeenReport
  })
  @ApiOkResponse({
    description: "Data of the deleted created Sighting post",
    type: PostDto,
    isArray: false

  })
  @UseGuards(JwtGuard)
  @Delete(':postId/seen-reports/:seenId')
  deleteSeenReport(@Param() params: DeleteSeenReport) {
    return this.postService.deleteSeenReport(params.postId, params.seenId);
  }

  /**
   * Creates a new post about a lost pet. User must be authenticated
   * @returns Post
   */
  @ApiBody({
    description: "DTO with the information of new lost pet's post",
    type: CreatePost
  })
  @ApiOkResponse({
    description: "Data of the newly created lost pet's post",
    type: PostDto,
    isArray: false

  })
  @UseGuards(JwtGuard)
  @Post()
  async createPost(@GetUser('id') userId: string, @Body() dto: CreatePost) {
    dto.author_id = userId;
    const postId = await this.postService.createPost(dto);
    if (process.env.NOTIFICATION_MODE === 'on')
      this.notificationsService.notifyUsers(postId);
    return { id: postId };
  }

  /**
  * Updates the post about a lost pet, searched by post's id. User must be authenticated
  * @returns Post
  */
  @ApiBody({
    description: "DTO with the new information to update the lost pet's post",
    type: UpdatePost
  })
  @ApiOkResponse({
    description: "Updated lost pet's post",
    type: PostDto,
    isArray: false

  })
  @UseGuards(JwtGuard)
  @Patch(':id')
  updatePostAsFound(
    @GetUser('id') userId: string,
    @Param() params: UUID,
    @Body() dto: UpdatePost,
  ) {
    return this.postService.updatePostAsFound(params.id, userId, dto);
  }

  /**
   * Deletes the provided post of a lost pet, based on the given ID. User must be authenticated
   * @returns Post
   */
  @ApiOkResponse({
    description: "Data of the deleted lost pet's post",
    type: PostDto,
    isArray: false

  })
  @UseGuards(JwtGuard)
  @Delete(':id')
  deletePost(@GetUser('id') userId: string, @Param() params: UUID) {
    return this.postService.deletePost(params.id, userId);
  }
}
