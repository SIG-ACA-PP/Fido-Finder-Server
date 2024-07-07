import { IsNotEmpty, IsNumber } from 'class-validator';


export class Point {
  /**
   * @example -89.275987643
   */
  @IsNumber()
  @IsNotEmpty()
  lon: number;

  /**
 * @example 13.678869689
 */
  @IsNumber()
  @IsNotEmpty()
  lat: number;
}
