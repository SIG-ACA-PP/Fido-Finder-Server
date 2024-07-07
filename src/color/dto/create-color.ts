import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColor {

  @ApiProperty({
    example: "Blanco"
  })
  @IsString()
  @IsNotEmpty()
  color: string;
}
