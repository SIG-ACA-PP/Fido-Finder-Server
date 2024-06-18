import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { Point } from 'src/models';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    return user;
  }

  // TODO
  // This function should set residence to geometry
  editUserResidence(userId: string, dto: Point) {}
  // This function should set residence to NULL
  deleteUserResidence(userId: string) {}

  // This function should set residence to geometry
  editUserLocation(userId: string, dto: Point) {}
  // This function should set current_location to NULL
  deleteUserLocation(userId: string) {}
}
