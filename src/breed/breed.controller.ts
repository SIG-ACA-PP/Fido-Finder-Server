import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BreedService } from './breed.service';
import { CreateBreed, CreateBreedType } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { isArray } from 'class-validator';

@ApiTags('Breed')
@Controller('breeds')
export class BreedController {
  constructor(private breedService: BreedService) { }

  /**
   * Get all the breeds in the database
   * @returns 
   */
  @ApiOkResponse({
    description: "Return all the breeds in the database",
    schema: {
      properties: {
        id: { example: 1 },
        type: { example: 1 },
        breed: { example: "Aguacatero" },
        breed_types: {
          examples:
          {
            id: 1,
            type: "Perro"
          }
        }

      },
    },
    isArray: true
  })
  @Get('/race')
  getBreeds() {
    return this.breedService.getBreeds();
  }

  /**
   * Get a single breed, searched by id
   * @param id 
   * @returns 
   */
  @ApiOkResponse({
    description: "Return a single breed from the database",
    schema: {
      properties: {
        id: { example: 1 },
        type: { example: 1 },
        breed: { example: "Aguacatero" },
        breed_types: {
          examples:
          {
            id: 1,
            type: "Perro"
          }
        }

      },
    },
    isArray: false
  })
  @Get('/race/:id')
  getOneBreed(@Param('id', ParseIntPipe) id: number) {
    return this.breedService.getOneBreed(id);
  }

  /**
   * Creates a new dog breed in the database. Uer must be authenticated
   * @param dto 
   * @returns 
   */
  @ApiBody({
    description: "DTO with the information of the new dog's breed",
    type: CreateBreed
  })
  @ApiOkResponse({
    description: "Return the info of the new breed",
    schema: {
      properties: {
        id: { example: 1 },
        type: { example: 1 },
        breed: { example: "Husky" },
        breed_types: {
          examples:
          {
            id: 1,
            type: "Perro"
          }
        }

      },
    },
    isArray: false
  })
  @UseGuards(JwtGuard)
  @Post('/race')
  createBreed(@Body() dto: CreateBreed) {
    return this.breedService.createBreed(dto);
  }

  /**
   * Get all the breed types in the database
   * @returns 
   */
  @ApiOkResponse({
    description: "Return all the breed types in the database",
    type: String,
    example: { breed: "herding" },
    isArray: true
  })
  @Get('/types')
  getBreedTypes() {
    return this.breedService.getBreedTypes();
  }

  /**
   * Get a single breed type from the database based in the provided ID
   * @returns 
   */
  @ApiOkResponse({
    description: "Return a single breed type from the database",
    example: { breed: "herding" },
    isArray: false
  })
  @Get('/types/:id')
  getOneBreedType(@Param('id', ParseIntPipe) id: number) {
    return this.breedService.getOneBreedType(id);
  }

  /**
  * Creates a new dog breed type in the database. Uer must be authenticated
  * @param dto 
  * @returns 
  */
  @ApiBody({
    description: "DTO with the information of the new dog's breed type",
    type: CreateBreedType
  })
  @ApiOkResponse({
    description: "Return the info of the new breed type",
    example: { breed: "herding" },
    isArray: false
  })
  @UseGuards(JwtGuard)
  @Post('/types')
  createBreedType(@Body() dto: CreateBreedType) {
    return this.breedService.createBreedType(dto);
  }
}
