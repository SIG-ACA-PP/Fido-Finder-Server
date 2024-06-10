import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UUID } from 'src/utils/dto';

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
}
