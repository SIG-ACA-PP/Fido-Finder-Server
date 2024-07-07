import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto, UserGeomsDto } from './dto';
import { Point } from 'src/models';
import { GeometryService } from 'src/geometry/geometry.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private geomService: GeometryService,
  ) {}

  getOneUser(userId: string) {
    return this.prisma.users.findUnique({
      include: {
        pets: {
          include: {
            colors: true,
            breeds: true,
          },
        },
      },
      where: { id: userId },
    });
  }

  async getOneUserResidence(userId: string): Promise<UserGeomsDto> {
    const res = await this.prisma.$queryRaw<UserGeomsDto[]>`
    SELECT 
        com.colonia as "community", 
        mun.nom_mun as "mun", 
        dep.nom_dpto as "dept"
      FROM users u
      LEFT JOIN municipios mun
        ON ST_Within(u.residence, mun.geom)
      LEFT JOIN departamentos dep
        ON ST_Within(u.residence, dep.geom)
      LEFT JOIN communities com
        ON ST_Within(u.residence, com.geom)
      WHERE u.id = ${userId}::uuid
  `;

    return {
      community: res?.[0].community || null,
      dept: res?.[0].dept || null,
      mun: res?.[0].mun || null,
    };
  }

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    return user;
  }

  async getUserResidence(userId: string) {
    const res = await this.prisma.$queryRaw`
      SELECT 
        ST_AsGeoJSON(residence) as residence
      FROM users
      WHERE id = ${userId}::uuid
    `;

    return { residence: res?.[0].residence || null };
  }

  // This function should set residence to geometry
  async editUserResidence(userId: string, dto: Point) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    const _point = this.geomService.createDBPoint(dto);

    return this.prisma.$queryRaw`
    UPDATE users
    SET residence=ST_GeomFromText(${_point}, 4326)
    WHERE id=${userId}::uuid
    `;
  }

  // This function should set residence to NULL
  async deleteUserResidence(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    return this.prisma.$queryRaw`
    UPDATE users
    SET residence=null
    WHERE id=${userId}::uuid
    `;
  }

  // This function should set residence to geometry
  async editUserLocation(userId: string, dto: Point) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    const _point = this.geomService.createDBPoint(dto);

    return this.prisma.$queryRaw`
    UPDATE users
    SET current_location=ST_GeomFromText(${_point}, 4326)
    WHERE id=${userId}::uuid
    `;
  }

  // This function should set current_location to NULL
  async deleteUserLocation(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    return this.prisma.$queryRaw`
    UPDATE users
    SET current_location=null
    WHERE id=${userId}::uuid
    `;
  }
}
