import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColor {
  /**
   * @example 'brown'
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;
}
