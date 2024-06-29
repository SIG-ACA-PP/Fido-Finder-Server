import { Global, Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';

@Global()
@Module({
  providers: [ColorService],
  controllers: [ColorController],
  exports: [ColorService]
})
export class ColorModule {}
