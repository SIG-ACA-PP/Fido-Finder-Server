import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) { }


  /**
  * Returns all the departments on the db
  *
  */
  @ApiOkResponse({
    description: "Return all departments on DB ", 
    type: Object, 
    isArray:true
  })
  @Get('/departments')
  getDepartments() {
    return this.statsService.getDepartments();
  }

 /**
  * Returns all the municipalities on the db
  *
  */
  @ApiOkResponse({
    description: "Return all municipalities on DB ", 
    type: Object, 
    isArray:true
  })
  @Get('/municipalities')
  getMunicipalities() {
    return this.statsService.getMunicipalities();
  }

   /**
   * Get all the pets lost by deparment
   * @returns 
   */
  @Get('/lost-pets/departments')
  getLostPetAmountsByDepartments() {
    return this.statsService.getLostPetAmountsByDepartments();
  }

  /**
   * Get all the pets lost by a single department, based on Id
   * @returns 
   */
  @Get('/lost-pets/departments/:id')
  getLostPetsByOneDepartment(@Param('id') id: string) {
    return this.statsService.getLostPetsByOneDepartment(id);
  }

  /**
   * Get all the pets lost by municipality
   * @returns 
   */
  @Get('/lost-pets/municipalities')
  getLostPetAmountsByMunicipalities() {
    return this.statsService.getLostPetAmountsByMunicipalities();
  }

  /**
   * Get all the pets lost by a single municipality, based on Id
   * @returns 
   */
  @Get('/lost-pets/municipalities/:id')
  getLostPetsByOneMunicipality(@Param('id', ParseIntPipe) id: number) {
    return this.statsService.getLostPetsByOneMunicipality(id);
  }

  /**
   * Get all the pets lost by communities
   * @returns 
   */
  @Get('/lost-pets/communities')
  getLostPetAmountsByCommunities() {
    return this.statsService.getLostPetAmountsByCommunities();
  }

  @Get('/test')
  test() {
    return { msg: 'Hello this is a test :) v3' };
  }
}
