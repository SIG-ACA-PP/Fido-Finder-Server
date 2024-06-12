import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBreedType {
  @IsString()
  @IsNotEmpty()
  type: string;
}
