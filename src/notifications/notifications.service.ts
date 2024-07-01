import { Injectable } from '@nestjs/common';
import { Point } from 'src/models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // Obtener todos los usuarios (id, correo, teléfono) que se encuentren
  // en un radio (2 km) del punto donde se reporta una mascota perdida (post.lost_in)
  // usando su residencia.
  async notifyNearUsersByResidence(point: Point, postId: string) {
    const users = await this.prisma.$queryRaw`
      SELECT u.id, u.email, u.phone_number
      FROM users u
      JOIN posts p 
      ON ST_DWithin(
          ST_Transform(u.residence, 3857), 
          ST_Transform(ST_SetSRID(ST_MakePoint(${point.lon}, ${point.lat}), 4326), 3857), 
          2000
      )
      WHERE p.is_lost = true
      AND p.id = ${postId}::uuid;
    `;

    return users;
  }


  // Obtain all users (id, email, phone) who are within
  // a radius (to be defined, for now use 2km) of
  // the point where a pet is reported lost (post.lost_in)
  // using their current location.
  notifyNearUsersByLocation(point: Point) {}

  // Obtain all users (id, email, phone) whose residence points
  // are in a neighborhood that also matches the point
  // where a pet is reported lost (post.lost_in).
  notifyNearUsersByCommunity(point: Point) {}

  private sendEmail() {}
  private sendWaMessage() {}
}
