import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GeometryService } from 'src/geometry/geometry.service';
import { Point } from 'src/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePost, UpdatePost } from './dto';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private geomService: GeometryService,
  ) {}

  findAll() {
    return this.prisma.$queryRaw`
      SELECT 
        id,
        pet_id,
        author_id,
        is_lost,
        lost_datetime,
        details,
        ST_AsGeoJSON(lost_in) as lost_in,
        ST_AsGeoJSON(found_in) as found_in
      FROM posts
    `;
  }

  findAllByUser(userId: string) {
    return this.prisma.$queryRaw`
      SELECT 
        id,
        pet_id,
        author_id,
        is_lost,
        lost_datetime,
        details,
        ST_AsGeoJSON(lost_in) as lost_in,
        ST_AsGeoJSON(found_in) as found_in
      FROM posts
      WHERE author_id = ${userId}::uuid
    `;
  }

  async findOneById(postId: string) {
    const posts: any[] = await this.prisma.$queryRaw`
      SELECT 
        id,
        pet_id,
        author_id,
        is_lost,
        lost_datetime,
        details,
        ST_AsGeoJSON(lost_in) as lost_in,
        ST_AsGeoJSON(found_in) as found_in
      FROM posts
      WHERE id = ${postId}::uuid
    `;

    if (!posts || posts?.length == 0)
      throw new NotFoundException('post not found');
    return posts?.[0];
  }

  findPostSeenReports(postId: string) {
    return this.prisma.$queryRaw`
      SELECT 
        id, 
        date_seen, 
        ST_AsGeoJSON(geom) as geom
      FROM places_seen_in
      WHERE post_id = ${postId}::uuid
    `;
  }

  createPost(dto: CreatePost) {
    const _point = this.geomService.createDBPoint(dto.lost_in);
    return this.prisma.$queryRaw`
      INSERT INTO posts (pet_id, author_id, lost_in, details)
      VALUES (
        ${dto.pet_id}::uuid,
        ${dto.author_id}::uuid,
        ST_GeomFromText(${_point}, 4326),
        ${dto.details}
      )
    `;
  }

  createPostSeenReport(postId: string, point: Point) {
    const _point = this.geomService.createDBPoint(point);
    return this.prisma.$queryRaw`
      INSERT INTO places_seen_in (post_id, geom)
      VALUES (
        ${postId}::uuid,
        ST_GeomFromText(${_point}, 4326)
      );
    `;
  }

  private async validatePostOwnership(postId: string, userId: string) {
    const post = await this.prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('post not found');
    if (post.author_id !== userId)
      throw new ForbiddenException('user not allowed to delete post');

    return post;
  }

  async updatePostAsFound(postId: string, userId: string, dto: UpdatePost) {
    await this.validatePostOwnership(postId, userId);

    const _point = this.geomService.createDBPoint(dto.found_in);
    return this.prisma.$queryRaw`
      UPDATE posts
      SET is_lost=FALSE, found_in=ST_GeomFromText(${_point}, 4326)
      WHERE id = ${postId}::uuid
    `;
  }

  async deletePost(postId: string, userId: string) {
    await this.validatePostOwnership(postId, userId);
    return this.prisma.posts.delete({
      where: {
        id: postId,
      },
    });
  }
}
