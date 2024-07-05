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


  /**
   * Works as a Who Am I? returns the id and the email of the current user
   */
  @ApiOkResponse({
    description: "Return information about the current user",
    schema: {
      properties:
      {
        id: { example: "fdaf9edd-f37d-4df4-b3e8-615a9c3faef3" },
        name: { example: null },
        lastname: { example: null },
        phone_number: { example: null },
        img: { example: null },
        email: { example: "eduarmercado@gmail.com" },
        dob: { example: null },
      }
    }
  })
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  /**
   * Find a single user by Id
   */
  @ApiOkResponse({
    description: 'Returns a user from the database',
    schema: {
      properties: {
        id: { example: 'db2637e4-d4f6-4625-a260-96cc1ccfb115' },
        name: { example: 'Jhon' },
        lastname: { example: 'Doe' },
        phone_number: { example: '7777-7777' },
        img: { example: 'https://src:/image.jpg' },
        email: { example: 'example@email.com' },
        dob: { example: '2000-01-01 00:00:00' },
        residence: { example: '-89.23820087731396 13.679140363245219' },
        current_location: { example: '-89.2414769068611 13.67678222181252' },
        pets: { example: 'pets[]' },
        posts: { example: 'posts[]' },

      }
    }
  })
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
    type: EditUserDto,
    description: 'DTO structure for update'
  })
  @ApiOkResponse({
    description: 'Returns the updated user from the database',
    schema: {
      properties: {
        id: { example: 'db2637e4-d4f6-4625-a260-96cc1ccfb115' },
        name: { example: 'Jhon' },
        lastname: { example: 'Doe' },
        phone_number: { example: '2525-2525' },
        img: { example: 'https://src:/image.jpg' },
        email: { example: 'example2@hotmail.com' },
        dob: { example: '2000-01-01 00:00:00' },
        residence: { example: '-89.23820087731396 13.679140363245219' },
        current_location: { example: '-89.2414769068611 13.67678222181252' },
        pets: { example: 'pets[]' },
        posts: { example: 'posts[]' },

      }
    }
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
  @ApiOkResponse({
    description: "Returns the GeoJson reference to the residence of the  user",
    schema: {
      properties: {
        "residence": { example: "{\"type\":\"Point\",\"coordinates\":[-89.275987643,13.678869575]}" }
      }
    }
  })
  @Get('/residence')
  getUserResidence(@GetUser('id') userId: string) {
    return this.userService.getUserResidence(userId);
  }

  /**
   * Updates the residence of a user
   * 
   */
  @ApiOkResponse({
    description: "Returns the GeoJson reference of the updated residence of the  user",
    schema: {
      properties: {
        "residence": { example: "{\"type\":\"Point\",\"coordinates\":[-89.275987643,13.678869689]}" }
      }
    }
  })
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
  @ApiOkResponse({
    description: "Returns the GeoJson reference of the updated location of the  user",
    schema: {
      properties: {
        "residence": { example: "{\"type\":\"Point\",\"coordinates\":[-89.275987643,13.678869689]}" }
      }
    }
  })
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
