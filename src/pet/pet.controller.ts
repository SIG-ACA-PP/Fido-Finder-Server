import {
  BadRequestException,
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
import { UpdatePet } from './dto/update-pet.dto';
import { ApiBody, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PetDto } from './dto/pet.dto';

@ApiTags('Pets')
@Controller('pets')
export class PetController {
  constructor(
    private petService: PetService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }


  /**
   * Returns an array with all the pets in the database. Pagination is possible
   * @returns Pets[]
   */
  @ApiOkResponse({
    description: "Returns an array with all the pets in the database. Pagination is possible",
    type: PetDto,
    isArray: true

  })
  @Get()
  findPets() {
    return this.petService.findAll();
  }

  /**
   * Get all the pets owned by the actual user
   * @param userId 
   * @returns 
   */
  @ApiOkResponse({
    description: "Returns an array with all the pets owned by the actual user.",
    type: PetDto,
    isArray: true

  })
  @ApiForbiddenResponse({ description: "Forbidden" })
  @UseGuards(JwtGuard)
  @Get('/own')
  findPetsByUser(@GetUser('id') userId: string) {
    return this.petService.findAllByUser(userId);
  }

  /**
   * Get a single pet based on it's id
   * @param userId 
   * @returns 
   */
  @ApiOkResponse({
    description: "Returns a single pet.",
    type: PetDto,
    isArray: false

  })
  @Get(':id')
  findPetById(@Param('id') id: string) {
    return this.petService.findOneById(id);
  }

  /**
   * Allows a user to register a new pet. Requieres authentication 
   * @param userId 
   * @param file 
   * @param dto 
   * @returns 
   */
  @ApiBody({
    type: PetDto,
    description: 'DTO structure for registering a new pet'
  })
  @ApiOkResponse({
    description: "Information of the newly created pet",
    type: PetDto,
    isArray: false

  })
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPet(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePet,
  ) {
    dto.img = null;
    dto.owner_id = userId;
    if (file) {
      const image = await this.cloudinaryService.uploadFile(file);
      dto.img = image?.url ?? null;
    }

    return this.petService.createPet(dto);
  }

  /**
   * Updates an existing pet, that belongs to the actual user. Requieres authentication
   * @param file 
   * @param id 
   * @param dto 
   * @returns 
   */
  @ApiBody({
    type: UpdatePet,
    description: 'DTO structure for updating a new pet'
  })
  @ApiOkResponse({
    description: "Updated info of the targeted pet",
    type: PetDto,
    isArray: false

  })
  @UseGuards(JwtGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() dto: UpdatePet,
  ) {
    if (file) {
      const image = await this.cloudinaryService.uploadFile(file);
      dto.img = image?.url ?? null;
      if (!image || !image.url)
        throw new InternalServerErrorException(
          'It was not possible to upload the image',
        );
    }

    return this.petService.updatePet(id, dto);
  }

  /**
   * Delete a previously registered pet. Requieres authentication
   * @param userId 
   * @param id 
   * @returns 
   */
  @ApiOkResponse({
    description: "Pet Deleted",
    type: PetDto,
    isArray: false

  })
  @UseGuards(JwtGuard)
  @Delete(':id')
  deletePet(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.petService.deletePet(id, userId);
  }
}
