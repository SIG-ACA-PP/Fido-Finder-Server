import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColor } from './dto';
import { JwtGuard } from 'src/auth/guard';

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

  @UseGuards(JwtGuard)
  @Post('')
  createColor(@Body() dto: CreateColor) {
    return this.colorService.createColor(dto);
  }
}
