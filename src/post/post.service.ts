import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GeometryService } from 'src/geometry/geometry.service';
import { Point } from 'src/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePost, UpdatePost } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private geomService: GeometryService,
  ) {}

  private async getGeometries(
    postId: string,
  ): Promise<{ lost_in: string | null; found_in: string | null }> {
    const data = await this.prisma.$queryRaw<
      {
        lost_in: string | null;
        found_in: string | null;
      }[]
    >`
      SELECT 
        ST_AsGeoJSON(lost_in) as lost_in,
        ST_AsGeoJSON(found_in) as found_in
      FROM posts
      WHERE id = ${postId}::uuid
    `;

    return data?.[0];
  }

  private async getGeometriesArr(
    postIds: string[],
  ): Promise<
    { id: string; lost_in: string | null; found_in: string | null }[]
  > {
    return await this.prisma.$queryRaw<
      { id: string; lost_in: string | null; found_in: string | null }[]
    >`
      SELECT 
        id,
        ST_AsGeoJSON(lost_in) as lost_in,
        ST_AsGeoJSON(found_in) as found_in
      FROM posts
      WHERE id::text IN (${Prisma.join(postIds)})
    `;
  }

  private combineResults(
    posts: any[],
    geoms: { id: string; lost_in: string; found_in: string }[],
  ) {
    return posts.map((post) => {
      const geom = geoms.find((g) => g.id === post.id);
      return {
        ...post,
        lost_in: geom?.lost_in,
        found_in: geom?.found_in,
      };
    });
  }

  async findAll(take: number, skip: number) {
    const posts = await this.prisma.posts.findMany({
      include: {
        users: true,
        pets: {
          include: {
            colors: true,
            breeds: true,
          },
        },
      },
      take,
      skip,
    });

    const postIds = posts.map((post) => post.id);
    const postsAndGeoms = await this.getGeometriesArr(postIds);
    return this.combineResults(posts, postsAndGeoms);
  }

  async findAllByUser(userId: string) {
    const posts = await this.prisma.posts.findMany({
      include: {
        users: true,
        pets: {
          include: {
            colors: true,
            breeds: true,
          },
        },
      },
      where: {
        author_id: userId,
      },
    });

    const postIds = posts.map((post) => post.id);
    const postsAndGeoms = await this.getGeometriesArr(postIds);
    return this.combineResults(posts, postsAndGeoms);
  }

  async findOneById(postId: string) {
    const post = await this.prisma.posts.findUnique({
      include: {
        users: true,
        pets: {
          include: {
            colors: true,
            breeds: true,
          },
        },
      },
      where: {
        id: postId,
      },
    });
    if (!post) throw new NotFoundException('post not found');

    const geom = await this.getGeometries(post.id);
    return {
      ...post,
      lost_in: geom?.lost_in,
      found_in: geom?.found_in,
    };
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

  async deleteSeenReport(postId: string, seenReportId: string) {
    return this.prisma.places_seen_in.delete({
      where: {
        id: seenReportId,
        post_id: postId,
      },
    });
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
