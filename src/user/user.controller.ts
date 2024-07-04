import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { users as User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { Point } from 'src/models';
import { UUID } from 'src/utils/dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }


  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  /**
   * Find a single user by Id
   */

  @Get('/find/:id')
  getOneUser(@Param() params: UUID) {
    return this.userService.getOneUser(params.id);
  }

  /**
   * Edit information from a specific user, searched by ID
   * @param userId 
   * @param dto 
   * @returns 
   */
  @ApiBody({
    type:EditUserDto,
    description:'DTO structure for update'
  })
  @Patch()
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  /**
   * Get the residence of a single user 
   * @param userId 
   * @returns User object, based on prisma model
   */
  @Get('/residence')
  getUserResidence(@GetUser('id') userId: string) {
    return this.userService.getUserResidence(userId);
  }

  /**
   * Updates the residence of a user
   */
  @Patch('/residence')
  editUserResidence(@GetUser('id') userId: string, @Body() dto: Point) {
    return this.userService.editUserResidence(userId, dto);
  }

  /**
   * Deletes the residence of a single user
   * @param userId 
   * @returns 
   */
  @Delete('/residence')
  deleteUserResidence(@GetUser('id') userId: string) {
    return this.userService.deleteUserResidence(userId);
  }

  /**
   * Updates the location of a single user
   * @param userId 
   * @param dto 
   * @returns 
   */
  @Patch('/location')
  editUserLocation(@GetUser('id') userId: string, @Body() dto: Point) {
    return this.userService.editUserLocation(userId, dto);
  }

  /**
   * Deletes the location of a single user
   * @param userId 
   * @returns 
   */
  @Delete('/location')
  deleteUserLocation(@GetUser('id') userId: string) {
    return this.userService.deleteUserLocation(userId);
  }
}
