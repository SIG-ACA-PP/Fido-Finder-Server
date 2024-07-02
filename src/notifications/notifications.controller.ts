import { Body, Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Point } from 'src/models';

// NOTE: This controller is just for tests
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) { }

  @Get('/users/residence')
  notifyNearUsersByResidence(@Body() dto: Point) {
    return this.notificationsService.notifyNearUsersByResidence(dto);
  }

  @Get('/users/location')
  notifyNearUsersByLocation(@Body() dto: Point) {
    return this.notificationsService.notifyNearUsersByLocation(dto);
  }

  @Get('/users/community')
  notifyNearUsersByCommunity(@Body() dto: Point) {
    return this.notificationsService.notifyNearUsersByCommunity(dto);
  }

  // test route for sending emails
  @Get('/users/email')
  async notifyUserByEmail() {
    try {
      const emails = ['00058820@uca.edu.sv', '00209020@uca.edu.sv', '00121520@uca.edu.sv', '00008020@uca.edu.sv']
      await this.notificationsService.sendEmail(emails, "easter", "padalustro", 'Que es obo');
    } catch (error: any) {
      console.log(error);
      return "Error sending email";
    }

    return 'Email Sent'
  }

  @Get('/all')
  testRoute() {
    return 'can access';
  }
}
