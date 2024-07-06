import { Body, Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Point } from 'src/models';
import { ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// NOTE: This controller is just for tests
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) { }

  /**
   * Sends a notification by email about a lost dog on the specify residence
   * @param dto 
   * @returns 
   */
  @ApiBody({
    description: "The GeoJson coordinates of the residence",
    type: Point
  })
  @ApiOkResponse({
    description: "Email sent to users",
    type: null
  })
  @ApiInternalServerErrorResponse({
    description: "Email could not been sent",
    type: Error
  })
  @Get('/users/residence')
  notifyNearUsersByResidence(@Body() dto: Point) {
    return this.notificationsService.notifyNearUsersByResidence(dto);
  }

  /**
   * Sends a notification by email about a lost dog on the specify location
   * @param dto 
   * @returns 
   */
  @ApiBody({
    description: "The GeoJson coordinates of the location",
    type: Point
  })
  @ApiOkResponse({
    description: "Email sent to users",
    type: null
  })
  @ApiInternalServerErrorResponse({
    description: "Email could not been sent",
    type: Error
  })
  @Get('/users/location')
  notifyNearUsersByLocation(@Body() dto: Point) {
    return this.notificationsService.notifyNearUsersByLocation(dto);
  }

  /**
   * Sends a notification by email about a lost dog on the specify community
   * @param dto 
   * @returns 
   */
  @ApiBody({
    description: "The GeoJson coordinates of the community",
    type: Point
  })
  @ApiOkResponse({
    description: "Email sent to users",
    type: null
  })
  @ApiInternalServerErrorResponse({
    description: "Email could not been sent",
    type: Error
  })
  @Get('/users/community')
  notifyNearUsersByCommunity(@Query('id') postId: string) {
    return this.notificationsService.notifyNearUsersByCommunity(postId);
  }
}
