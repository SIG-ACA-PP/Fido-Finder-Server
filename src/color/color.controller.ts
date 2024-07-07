import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColor } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Color')
@Controller('colors')
export class ColorController {
  constructor(private colorService: ColorService) { }

  /** 
   * Get all the colors in the database
  */
  @ApiOkResponse({
    description: "Returns all the colors in the database",
    schema:
    {
      properties:
      {
        color: { example: "Cafe" }
      }
    },
    isArray: true
  })
  @Get('')
  getColors() {
    return this.colorService.getColors();
  }

  /**
   * Gets a single color, based on the given ID
   * @param id 
   * @returns 
   */
  @ApiOkResponse({
    description: "Returns a single color from the database",
    schema:
    {
      properties:
      {
        color: { example: "Cafe" }
      }
    },
    isArray: false
  })
  @Get(':id')
  getOneColor(@Param('id', ParseIntPipe) id: number) {
    return this.colorService.getOneColor(id);
  }

  /**
   * Creates a new color in the database. User must be authenticated
   * @param dto 
   * @returns 
   */
  @ApiBody({
    description: "DTO with the information of the new color",
    type: CreateColor
  })
  @ApiOkResponse({
    description: "Returns the information of the new color",
    schema:
    {
      properties:
      {
        color: { example: "Blanco" }
      }
    },
    isArray: false
  })
  @UseGuards(JwtGuard)
  @Post('')
  createColor(@Body() dto: CreateColor) {
    return this.colorService.createColor(dto);
  }
}
