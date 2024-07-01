import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  // Obtain the number of lost pets grouped by department.
  async getLostPetAmountsByDepartments() {
    const results = await this.prisma.$queryRaw`
      SELECT d.nom_dpto AS department, COUNT(p.id) AS lost_pets_count
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
      SELECT p.lost_in
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
      SELECT m.nom_mun AS municipality, COUNT(p.id) AS lost_pets_count
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
      SELECT p.lost_in
      FROM posts p
      JOIN municipios m ON ST_Within(p.lost_in, m.geom)
      WHERE m.cod_mun = ${munId}
        AND p.is_lost = true;
    `;

    return results;
  }

  // Obtain the number of lost pets grouped by communities
  getLostPetAmountsByCommunities() {}
}
