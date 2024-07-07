import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('/departments')
  getDepartments() {
    return this.statsService.getDepartments();
  }

  @Get('/municipalities')
  getMunicipalities() {
    return this.statsService.getMunicipalities();
  }

  @Get('/lost-pets/departments')
  getLostPetAmountsByDepartments() {
    return this.statsService.getLostPetAmountsByDepartments();
  }

  @Get('/lost-pets/departments/:id')
  getLostPetsByOneDepartment(@Param('id') id: string) {
    return this.statsService.getLostPetsByOneDepartment(id);
  }

  @Get('/lost-pets/municipalities')
  getLostPetAmountsByMunicipalities() {
    return this.statsService.getLostPetAmountsByMunicipalities();
  }

  @Get('/lost-pets/municipalities/:id')
  getLostPetsByOneMunicipality(@Param('id', ParseIntPipe) id: number) {
    return this.statsService.getLostPetsByOneMunicipality(id);
  }

  @Get('/lost-pets/communities')
  getLostPetAmountsByCommunities() {
    return this.statsService.getLostPetAmountsByCommunities();
  }

  @Get('/test')
  test() {
    return { msg: 'Hello this is a test :) v3' };
  }
}
