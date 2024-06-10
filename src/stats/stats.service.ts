import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  // Obtain the number of lost pets grouped by department.
  getLostPetAmountsByDepartments() {}

  // Retrieve the locations (post.lost_in) as geom
  // of lost pet reports within a specific department,
  // accepting the department ID as input.
  getLostPetsByOneDepartment(deptId: number) {}

  // Obtain the number of lost pets grouped by municipalities.
  getLostPetAmountsByMunicipalities() {}

  // Retrieve the locations (post.lost_in) as geom
  // of lost pet reports within a specific municipality,
  // accepting the municipality ID as input.
  getLostPetsByOneMunicipality(munId: number) {}

  // Obtain the number of lost pets grouped by communities
  getLostPetAmountsByCommunities() {}
}
