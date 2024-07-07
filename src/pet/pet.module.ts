import { Global, Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';

@Global()
@Module({
  providers: [PetService],
  controllers: [PetController],
  exports: [PetService]
})
export class PetModule {}
