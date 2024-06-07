import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColor {
  @IsString()
  @IsNotEmpty()
  color: string;
}
