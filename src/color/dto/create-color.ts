import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColor {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;
}
