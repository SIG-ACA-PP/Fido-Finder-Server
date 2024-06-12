import { Global, Module } from '@nestjs/common';
import { GeometryService } from './geometry.service';

@Global()
@Module({
  providers: [GeometryService],
  exports: [GeometryService]
})
export class GeometryModule {}
