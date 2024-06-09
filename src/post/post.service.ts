import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

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
}
