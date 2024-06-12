import { Module } from '@nestjs/common';
import { BreedService } from './breed.service';
import { BreedController } from './breed.controller';

@Module({
  providers: [BreedService],
  controllers: [BreedController]
})
export class BreedModule {}
