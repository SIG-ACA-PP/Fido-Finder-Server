import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBreed {
  @IsNumber()
  @IsNotEmpty()
  type: number;

  @IsString()
  @IsNotEmpty()
  breed: string;
}
