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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('')
  findPosts(@Query() paginationQuery: PaginationQueryDto) {
    const { take = 10, skip = 0 } = paginationQuery;
    return this.postService.findAll(take, skip);
  }

  @UseGuards(JwtGuard)
  @Get('/own')
  findPostsByUser(@GetUser('id') userId: string) {
    return this.postService.findAllByUser(userId);
  }

  @Get(':id')
  findPostById(@Param() params: UUID) {
    return this.postService.findOneById(params.id);
  }

  @Get(':id/seen-reports')
  findPostSeenReports(@Param() params: UUID) {
    return this.postService.findPostSeenReports(params.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/seen-reports')
  createPostSeenReport(@Param() params: UUID, @Body() dto: Point) {
    return this.postService.createPostSeenReport(params.id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':postId/seen-reports/:seenId')
  deleteSeenReport(@Param() params: DeleteSeenReport) {
    return this.postService.deleteSeenReport(params.postId, params.seenId);
  }

  @UseGuards(JwtGuard)
  @Post('')
  createPost(@GetUser('id') userId: string, @Body() dto: CreatePost) {
    dto.author_id = userId;
    return this.postService.createPost(dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updatePostAsFound(
    @GetUser('id') userId: string,
    @Param() params: UUID,
    @Body() dto: UpdatePost,
  ) {
    return this.postService.updatePostAsFound(params.id, userId, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deletePost(@GetUser('id') userId: string, @Param() params: UUID) {
    return this.postService.deletePost(params.id, userId);
  }
}
