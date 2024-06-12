import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { users as User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Patch('/residence')
  editUserResidence(@GetUser('id') userId: string) {
    return this.userService.editUserResidence(userId);
  }

  @Delete('/residence')
  deleteUserResidence(@GetUser('id') userId: string) {
    return this.userService.deleteUserResidence(userId);
  }

  @Patch('/location')
  editUserLocation(@GetUser('id') userId: string) {
    return this.userService.editUserLocation(userId);
  }

  @Patch('/location')
  deleteUserLocation(@GetUser('id') userId: string) {
    return this.userService.deleteUserLocation(userId);
  }
}
