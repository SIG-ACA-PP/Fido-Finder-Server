import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColor } from './dto';

@Controller('colors')
export class ColorController {
  constructor(private colorService: ColorService) {}

  @Get('')
  getColors() {
    return this.colorService.getColors();
  }

  @Get(':id')
  getOneColor(@Param('id', ParseIntPipe) id: number) {
    return this.colorService.getOneColor(id);
  }

  @Post('')
  createColor(@Body() dto: CreateColor) {
    return this.colorService.createColor(dto);
  }
}
