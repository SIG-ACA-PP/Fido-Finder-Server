import { Global, Module } from '@nestjs/common';
import { BreedService } from './breed.service';
import { BreedController } from './breed.controller';

@Global()
@Module({
  providers: [BreedService],
  controllers: [BreedController],
  exports: [BreedService]
})
export class BreedModule {}
