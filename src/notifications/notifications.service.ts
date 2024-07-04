import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Point } from 'src/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from 'src/utils/dto/message';
import { NotifyUserDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  // Obtain all users (id, name, lastname, email, phone) who are within
  // a radius (to be defined, for now use 2km) of
  // the point where a pet is reported lost (post.lost_in)
  // using their residence.
  async notifyNearUsersByResidence(point: Point): Promise<NotifyUserDto[]> {
    const users = await this.prisma.$queryRaw`
      SELECT u.id, u.name, u.lastname, u.email, u.phone_number
      FROM users u
      WHERE ST_DWithin(
          ST_Transform(u.residence, 3857), 
          ST_Transform(ST_SetSRID(ST_MakePoint(${point.lon}, ${point.lat}), 4326), 3857), 
          2000
      );
    `;

    const data = users as NotifyUserDto[];
    data.forEach((user) =>
      this.sendEmail(user.email, 'residence', 'colonia x', 'Fido Finder Alerts'),
    );

    return data;
  }

  // Obtain all users (id, name, lastname, email, phone) who are within
  // a radius (to be defined, for now use 2km) of
  // the point where a pet is reported lost (post.lost_in)
  // using their current location.
  async notifyNearUsersByLocation(point: Point): Promise<NotifyUserDto[]> {
    const users = await this.prisma.$queryRaw`
      SELECT u.id, u.name, u.lastname, u.email, u.phone_number
      FROM users u
      WHERE ST_DWithin(
          ST_Transform(u.current_location, 3857), 
          ST_Transform(ST_SetSRID(ST_MakePoint(${point.lon}, ${point.lat}), 4326), 3857), 
          2000
      );
    `;

    return users as NotifyUserDto[];
  }

  // Obtain all users (id, name, lastname, email, phone) whose residence points
  // are in a neighborhood that also matches the point
  // where a pet is reported lost (post.lost_in).
  async notifyNearUsersByCommunity(postId: string): Promise<NotifyUserDto[]> {
    const users = await this.prisma.$queryRaw`
      WITH lost_community AS (
          SELECT colonia
          FROM communities
          JOIN posts p ON ST_Within(p.lost_in, communities.geom)
          WHERE p.id = ${postId}::uuid
          AND p.is_lost = true
          LIMIT 1
      )
      SELECT u.id, u.name, u.lastname, u.email, u.phone_number
      FROM users u
      JOIN communities c ON ST_Within(u.residence, c.geom)
      WHERE c.colonia = (SELECT colonia FROM lost_community);
    `;

    return users as NotifyUserDto[];
  }

  // Send email
  async sendEmail(
    email: string,
    messageOption: 'residence' | 'location' | 'community' | 'easter',
    geography: string,
    subject: string,
  ) {
    const message = Message.getMessage(messageOption, geography);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        text: message,
      });
    } catch (error: any) {
      console.log(error);
    }
  }

  private sendWaMessage() {}
}
