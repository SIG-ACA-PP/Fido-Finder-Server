import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePet } from './dto';
import { UpdatePet } from './dto/update-pet.dto';

@Injectable()
export class PetService {
  constructor(private prisma: PrismaService) {}

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

  createPet(dto: CreatePet) {
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
