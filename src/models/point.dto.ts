import { IsNotEmpty, IsNumber } from 'class-validator';

export class Point {
  @IsNumber()
  @IsNotEmpty()
  lon: number;
  
  @IsNumber()
  @IsNotEmpty()
  lat: number;
}
