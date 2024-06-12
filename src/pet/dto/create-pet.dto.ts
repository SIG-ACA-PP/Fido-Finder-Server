import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePet {
  owner_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  color_id: number;

  @IsNumber()
  @IsOptional()
  breed_id: number;

  @IsString()
  @IsOptional()
  description: string;
}
