import { Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

// NOTE: This controller is just for tests
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('/users/residence')
  notifyNearUsersByResidence(@Query('id') postId: string) {
    return this.notificationsService.notifyNearUsersByResidence(postId);
  }

  @Get('/users/location')
  notifyNearUsersByLocation(@Query('id') postId: string) {
    return this.notificationsService.notifyNearUsersByLocation(postId);
  }

  @Get('/users/community')
  notifyNearUsersByCommunity(@Query('id') postId: string) {
    return this.notificationsService.notifyNearUsersByCommunity(postId);
  }

  // test route for sending emails
  @Get('/users/email')
  async notifyUserByEmail() {
    try {
      const emails = [
        '00058820@uca.edu.sv',
        '00209020@uca.edu.sv',
        '00121520@uca.edu.sv',
        '00008020@uca.edu.sv',
      ];
      await this.notificationsService.sendEmail(
        emails,
        'easter',
        'padalustro',
        'Que es obo',
      );
    } catch (error: any) {
      console.log(error);
      return 'Error sending email';
    }

    return 'Email Sent';
  }

  @Get('/all')
  testRoute() {
    return 'can access';
  }
}
