import { Body, Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Point } from 'src/models';
import { ApiTags } from '@nestjs/swagger';

// NOTE: This controller is just for tests
@ApiTags('Notifications')
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
  notifyNearUsersByCommunity(@Query('id') postId: string) {
    return this.notificationsService.notifyNearUsersByCommunity(postId);
  }
}
