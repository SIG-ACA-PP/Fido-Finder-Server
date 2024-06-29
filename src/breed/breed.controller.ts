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

@Controller('breeds')
export class BreedController {
  constructor(private breedService: BreedService) {}

  @Get('/race')
  getBreeds() {
    return this.breedService.getBreeds();
  }

  @Get('/race/:id')
  getOneBreed(@Param('id', ParseIntPipe) id: number) {
    return this.breedService.getOneBreed(id);
  }

  @UseGuards(JwtGuard)
  @Post('/race')
  createBreed(@Body() dto: CreateBreed) {
    return this.breedService.createBreed(dto);
  }

  @Get('/types')
  getBreedTypes() {
    return this.breedService.getBreedTypes();
  }

  @Get('/types/:id')
  getOneBreedType(@Param('id', ParseIntPipe) id: number) {
    return this.breedService.getOneBreedType(id);
  }

  @UseGuards(JwtGuard)
  @Post('/types')
  createBreedType(@Body() dto: CreateBreedType) {
    return this.breedService.createBreedType(dto);
  }
}
