import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColor } from './dto';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}

  getColors() {
    return this.prisma.colors.findMany();
  }

  getOneColor(id: number) {
    return this.prisma.colors.findFirst({
      where: {
        id,
      },
    });
  }

  createColor(dto: CreateColor) {
    return this.prisma.colors.create({
      data: {
        ...dto,
      },
    });
  }
}
