import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { send } from 'process';
import { Point } from 'src/models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private readonly mailerService: MailerService) {}

  // Obtain all users (id, email, phone) who are within
  // a radius (to be defined, for now use 2km) of
  // the point where a pet is reported lost (post.lost_in)
  // using their residence.
  notifyNearUsersByResidence(point: Point) {}

  // Obtain all users (id, email, phone) who are within
  // a radius (to be defined, for now use 2km) of
  // the point where a pet is reported lost (post.lost_in)
  // using their current location.
  notifyNearUsersByLocation(point: Point) {}

  // Obtain all users (id, email, phone) whose residence points
  // are in a neighborhood that also matches the point
  // where a pet is reported lost (post.lost_in).
  notifyNearUsersByCommunity(point: Point) {}

  private async sendEmail(message : string, userId: string) {
    const user = await this.prisma.users.findUnique({
      where:{
        id:userId,
      }
    });

    if(!user) throw new NotFoundException("User not found");

    if(!message)
      {
        message = `Hello ${user.name} \n
        
        Welcome to Fido Finder, this is a test email \n

        Our Regards \n
        the Fido Finder Team
        `;
      }

      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Test Email',
          text:message,
        }); 
      } catch (error : any) {
       console.log(error); 
      }
      

  }
  private sendWaMessage() {}
}
