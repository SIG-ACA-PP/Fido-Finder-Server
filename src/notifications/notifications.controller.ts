import { Body, Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Point } from 'src/models';

// NOTE: This controller is just for tests
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

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
}
