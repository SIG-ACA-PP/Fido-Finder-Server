import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ColorService } from './color.service';

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
}
