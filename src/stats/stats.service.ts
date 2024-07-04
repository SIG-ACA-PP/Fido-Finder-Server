import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  // Obtain the number of lost pets grouped by department.
  async getLostPetAmountsByDepartments() {
    const results = await this.prisma.$queryRaw`
      SELECT d.nom_dpto AS department, CAST(COUNT(p.id) AS INTEGER) AS lost_pets_count
      FROM departamentos d
      JOIN posts p ON ST_Within(p.lost_in, d.geom)
      WHERE p.is_lost = true
      GROUP BY d.nom_dpto;
    `;

    return results;
  }

  // Retrieve the locations (post.lost_in) as geom
  // of lost pet reports within a specific department,
  // accepting the department ID as input.
  async getLostPetsByOneDepartment(deptId: string) {
    const results = await this.prisma.$queryRaw`
      SELECT ST_AsGeoJSON(p.lost_in) as geom
      FROM posts p
      JOIN departamentos d ON ST_Within(p.lost_in, d.geom)
      WHERE d.cod_dpto = ${deptId}
        AND p.is_lost = true;
    `;

    return results;
  }

  // Obtain the number of lost pets grouped by municipalities.
  async getLostPetAmountsByMunicipalities() {
    const results = await this.prisma.$queryRaw`
      SELECT m.nom_mun AS municipality, CAST(COUNT(p.id) AS INTEGER) AS lost_pets_count
      FROM municipios m
      JOIN posts p ON ST_Within(p.lost_in, m.geom)
      WHERE p.is_lost = true
      GROUP BY m.nom_mun;
    `;

    return results;
  }

  // Retrieve the locations (post.lost_in) as geom
  // of lost pet reports within a specific municipality,
  // accepting the municipality ID as input.
  async getLostPetsByOneMunicipality(munId: string) {
    const results = await this.prisma.$queryRaw`
      SELECT ST_AsGeoJSON(p.lost_in) as geom
      FROM posts p
      JOIN municipios m ON ST_Within(p.lost_in, m.geom)
      WHERE m.cod_mun = ${munId}
        AND p.is_lost = true;
    `;

    return results;
  }

  // Obtain the number of lost pets grouped by communities.
  async getLostPetAmountsByCommunities() {
    const results = await this.prisma.$queryRaw`
      WITH lost_pets_per_community AS (
        SELECT c.colonia, p.id
        FROM communities c
        JOIN posts p ON ST_Within(p.lost_in, c.geom)
        WHERE p.is_lost = true
      )
      SELECT colonia, CAST(COUNT(id) AS INTEGER) AS lost_pets_count
      FROM lost_pets_per_community
      GROUP BY colonia;
    `;

    return results;
  }
}
