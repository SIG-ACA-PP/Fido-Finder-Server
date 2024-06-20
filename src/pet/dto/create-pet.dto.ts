import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePet {
  owner_id: string;
  img: string | null;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  @IsOptional()
  color_id: number;

  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  @IsOptional()
  breed_id: number;

  @IsString()
  @IsOptional()
  description: string;
}
