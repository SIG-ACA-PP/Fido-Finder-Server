import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from 'src/utils/dto/message';
import { NotifyUserDto } from './dto';
import { PostService } from 'src/post/post.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private postService: PostService,
    private readonly mailerService: MailerService,
  ) {}

  async notifyUsers(postId: string) {
    const post = await this.postService.findOneById(postId);
    const location: string =
      post.locationInfo.community ??
      post.locationInfo.mun ??
      post.locationInfo.dept;
    const title: string = `Fido Finder Alerts - ${post.pets.name ?? ''}`;

    const usersByResidence = await this.notifyNearUsersByResidence(postId);
    const emailsByResidence = usersByResidence.map((user) => user.email);
    await this.sendEmail(emailsByResidence, 'residence', location, title);


    const usersByLocation = await this.notifyNearUsersByLocation(postId);
    const emailsByLocation = usersByLocation.map((user) => user.email);
    await this.sendEmail(emailsByLocation, 'location', location, title);
  }

  // Obtain all users (id, name, lastname, email, phone) who are within
  // a radius (to be defined, for now use 2km) of
  // the point where a pet is reported lost (post.lost_in)
  // using their residence.
  async notifyNearUsersByResidence(postId: string): Promise<NotifyUserDto[]> {
    const users = await this.prisma.$queryRaw`
      SELECT u.id, u.name, u.lastname, u.email, u.phone_number
      FROM users u
      JOIN posts p ON p.id = ${postId}::uuid
      WHERE ST_DWithin(
          ST_Transform(u.residence, 3857), 
          ST_Transform(p.lost_in, 3857), 
          2000
      );
    `;

    return users as NotifyUserDto[];
  }

  // Obtain all users (id, name, lastname, email, phone) who are within
  // a radius (to be defined, for now use 2km) of
  // the point where a pet is reported lost (post.lost_in)
  // using their current location.
  async notifyNearUsersByLocation(postId: string): Promise<NotifyUserDto[]> {
    const users = await this.prisma.$queryRaw`
      SELECT u.id, u.name, u.lastname, u.email, u.phone_number
      FROM users u
      JOIN posts p ON p.id = ${postId}::uuid
      WHERE ST_DWithin(
          ST_Transform(u.current_location, 3857), 
          ST_Transform(p.lost_in, 3857), 
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

  // Send emails
  async sendEmail(
    emails: string[],
    messageOption: 'residence' | 'location' | 'community' | 'easter',
    geography: string,
    subject: string,
  ) {
    const message = Message.getMessage(messageOption, geography);

    try {
      await this.mailerService.sendMail({
        to: emails,
        subject: subject,
        text: message,
      });
    } catch (error: any) {
      console.log(error);
    }
  }

  private sendWaMessage() {}
}
