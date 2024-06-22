import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  dob?: Date;
}
