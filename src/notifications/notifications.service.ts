import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Point } from 'src/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { users as User } from '@prisma/client';
import { Message } from 'src/utils/dto/message';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private readonly mailerService: MailerService) { }



  // Obtain all users (id, email, phone) who are within
  // a radius (to be defined, for now use 2km) of
  // the point where a pet is reported lost (post.lost_in)
  // using their residence.
  notifyNearUsersByResidence(point: Point) { }

  // Obtain all users (id, email, phone) who are within
  // a radius (to be defined, for now use 2km) of
  // the point where a pet is reported lost (post.lost_in)
  // using their current location.
  notifyNearUsersByLocation(point: Point) { }

  // Obtain all users (id, email, phone) whose residence points
  // are in a neighborhood that also matches the point
  // where a pet is reported lost (post.lost_in).
  notifyNearUsersByCommunity(point: Point) { }

  //Send multiple emails
  async sendEmail(users: string[], messageOption: string, geography: string, subject: string) {

    //const userEmails = users.map((u) => u.email)

    const message = Message.getMessage(messageOption, geography);

    try {
      await this.mailerService.sendMail({
        to: users,
        subject: subject,
        text: message,
      });
    } catch (error: any) {
      console.log(error);
    }


  }
  private sendWaMessage() { }
}
