import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePet } from './dto';
import { UpdatePet } from './dto/update-pet.dto';
import { ColorService } from 'src/color/color.service';
import { BreedService } from 'src/breed/breed.service';

@Injectable()
export class PetService {
  constructor(
    private prisma: PrismaService,
    private colorService: ColorService,
    private breedService: BreedService,
  ) {}

  findAll() {
    return this.prisma.pets.findMany({
      include: {
        breeds: true,
        colors: true,
      },
    });
  }

  findAllByUser(userId: string) {
    return this.prisma.pets.findMany({
      include: {
        breeds: true,
        colors: true,
      },
      where: {
        owner_id: userId,
      },
    });
  }

  findOneById(petId: string) {
    return this.prisma.pets.findUnique({
      include: {
        breeds: true,
        colors: true,
      },
      where: {
        id: petId,
      },
    });
  }

  async createPet(dto: CreatePet) {
    if (!(await this.colorService.getOneColor(dto.color_id)))
      throw new BadRequestException('color not found');
    if (!(await this.breedService.getOneBreed(dto.breed_id)))
      throw new BadRequestException('breed not found');

    return this.prisma.pets.create({
      data: {
        ...dto,
      },
    });
  }

  updatePet(petId: string, dto: UpdatePet) {
    return this.prisma.pets.update({
      data: {
        ...dto,
      },
      where: {
        id: petId,
      },
    });
  }

  async deletePet(petId: string, userId: string) {
    const pet = await this.findOneById(petId);
    if (!pet) throw new NotFoundException('pet not found');
    if (pet.owner_id !== userId)
      throw new ForbiddenException('user is not allowed delete pet');

    return this.prisma.pets.delete({
      where: {
        id: petId,
      },
    });
  }
}
