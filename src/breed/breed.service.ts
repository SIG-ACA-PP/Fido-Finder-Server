import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBreed, CreateBreedType } from './dto';

@Injectable()
export class BreedService {
  constructor(private prisma: PrismaService) {}

  getBreeds() {
    return this.prisma.breeds.findMany({
      include: {
        breed_types: true,
      },
    });
  }

  getOneBreed(id: number) {
    return this.prisma.breeds.findUnique({
      include: {
        breed_types: true,
      },
      where: { id },
    });
  }

  getBreedTypes() {
    return this.prisma.breed_types.findMany();
  }

  getOneBreedType(id: number) {
    return this.prisma.breed_types.findUnique({
      where: { id },
    });
  }

  createBreed(dto: CreateBreed) {
    return this.prisma.breeds.create({
      data: {
        ...dto,
      },
    });
  }

  createBreedType(dto: CreateBreedType) {
    return this.prisma.breed_types.create({
      data: {
        ...dto,
      },
    });
  }
}
