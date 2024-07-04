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

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('/find/:id')
  getOneUser(@Param() params: UUID) {
    return this.userService.getOneUser(params.id);
  }

  @Patch()
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Get('/residence')
  getUserResidence(@GetUser('id') userId: string) {
    return this.userService.getUserResidence(userId);
  }

  @Patch('/residence')
  editUserResidence(@GetUser('id') userId: string, @Body() dto: Point) {
    return this.userService.editUserResidence(userId, dto);
  }

  @Delete('/residence')
  deleteUserResidence(@GetUser('id') userId: string) {
    return this.userService.deleteUserResidence(userId);
  }

  @Patch('/location')
  editUserLocation(@GetUser('id') userId: string, @Body() dto: Point) {
    return this.userService.editUserLocation(userId, dto);
  }

  @Delete('/location')
  deleteUserLocation(@GetUser('id') userId: string) {
    return this.userService.deleteUserLocation(userId);
  }
}
