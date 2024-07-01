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
      await this.notificationsService.sendEmail("", '92991a2b-251c-468d-9bb9-2b7de0332eab');
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
