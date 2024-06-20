import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreatePet } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('pets')
export class PetController {
  constructor(
    private petService: PetService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
  @Patch(':id/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const image = await this.cloudinaryService.uploadFile(file);
    if (!image || !image.url)
      throw new InternalServerErrorException(
        'It was not possible to upload the image',
      );

    return this.petService.updatePet(id, { img: image.url });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deletePet(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.petService.deletePet(id, userId);
  }
}
