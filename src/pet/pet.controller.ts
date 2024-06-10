import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreatePet } from './dto';

@Controller('pets')
export class PetController {
  constructor(private petService: PetService) {}

  // TODO: add pagination
  @Get('')
  findPets() {
    return this.petService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('/own')
  findPetsByUser(@GetUser('id') userId: string) {
    return this.petService.findAllByUser(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findPetById(@Param('id') id: string) {
    return this.petService.findOneById(id);
  }

  @UseGuards(JwtGuard)
  @Post('')
  createPet(@GetUser('id') userId: string, @Body() dto: CreatePet) {
    dto.owner_id = userId;
    return this.petService.createPet(dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deletePet(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.petService.deletePet(id, userId);
  }
}
