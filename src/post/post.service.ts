import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GeometryService } from 'src/geometry/geometry.service';
import { Point } from 'src/models';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePost,
  PostGeomsDto,
  PostGeomsWithIdDto,
  UpdatePost,
} from './dto';
import { Prisma } from '@prisma/client';
import { PostDto } from './dto/post.dto';
import { PetService } from 'src/pet/pet.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private petService: PetService,
    private geomService: GeometryService,
  ) {}

  private async getGeometries(postId: string): Promise<PostGeomsDto> {
    const data = await this.prisma.$queryRaw<PostGeomsDto[]>`
      SELECT 
        ST_AsGeoJSON(p.lost_in) as lost_in,
        ST_AsGeoJSON(p.found_in) as found_in,
        com.colonia as "community", 
        mun.nom_mun as "mun", 
        dep.nom_dpto as "dept"
      FROM posts p
      LEFT JOIN municipios mun
        ON ST_Within(p.lost_in, mun.geom)
      LEFT JOIN departamentos dep
        ON ST_Within(p.lost_in, dep.geom)
      LEFT JOIN communities com
        ON ST_Within(p.lost_in, com.geom)
      WHERE p.id = ${postId}::uuid
    `;

    return data?.[0];
  }

  private async getGeometriesArr(
    postIds: string[],
  ): Promise<PostGeomsWithIdDto[]> {
    return await this.prisma.$queryRaw<PostGeomsWithIdDto[]>`
      SELECT 
        p.id,
        ST_AsGeoJSON(p.lost_in) as lost_in,
        ST_AsGeoJSON(p.found_in) as found_in,
        com.colonia as "community", 
        mun.nom_mun as "mun", 
        dep.nom_dpto as "dept"
      FROM posts p
      LEFT JOIN municipios mun
        ON ST_Within(p.lost_in, mun.geom)
      LEFT JOIN departamentos dep
        ON ST_Within(p.lost_in, dep.geom)
      LEFT JOIN communities com
        ON ST_Within(p.lost_in, com.geom)
      WHERE p.id::text IN (${Prisma.join(postIds)})
    `;
  }

  private combineResults(
    posts: PostDto[],
    geoms: PostGeomsWithIdDto[],
  ): PostDto[] {
    return posts.map((post) => {
      const geom = geoms.find((g) => g.id === post.id);
      return {
        ...post,
        lost_in: geom?.lost_in,
        found_in: geom?.found_in,
        locationInfo: {
          dept: geom?.dept,
          mun: geom?.mun,
          community: geom?.community,
        },
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
    if (posts.length === 0) return [];

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
    if (posts.length === 0) return [];

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
      locationInfo: {
        dept: geom?.dept,
        mun: geom?.mun,
        community: geom?.community,
      },
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

  async createPost(dto: CreatePost): Promise<string> {
    const pet = await this.petService.findOneById(dto.pet_id);
    if (!pet) throw new BadRequestException('pet not found');
    if (pet.owner_id !== dto.author_id)
      throw new ForbiddenException(
        'You do not have permission to post this pet',
      );

    const _point = this.geomService.createDBPoint(dto.lost_in);
    const result = await this.prisma.$queryRaw`
      INSERT INTO posts (pet_id, author_id, lost_in, details)
      VALUES (
        ${dto.pet_id}::uuid,
        ${dto.author_id}::uuid,
        ST_GeomFromText(${_point}, 4326),
        ${dto.details}
      )
      RETURNING id;
    `;
    return result[0].id;
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
