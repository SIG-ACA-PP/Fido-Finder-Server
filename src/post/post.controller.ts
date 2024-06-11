import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UUID } from 'src/utils/dto';
import { Point } from 'src/models';
import { CreatePost } from './dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('')
  findPosts() {
    return this.postService.findAll();
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
  @Post('')
  createPost(@GetUser('id') userId: string, @Body() dto: CreatePost) {
    dto.author_id = userId;
    return this.postService.createPost(dto);
  }

  @Post(':id/seen-reports')
  createPostSeenReport(@Param() params: UUID, @Body() dto: Point) {
    return this.postService.createPostSeenReport(params.id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deletePost(@GetUser('id') userId: string, @Param() params: UUID) {
    return this.postService.deletePost(params.id, userId);
  }
}
