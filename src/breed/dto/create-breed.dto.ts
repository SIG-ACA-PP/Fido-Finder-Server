import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBreed {
  /**
   * @example 2
   */
  @IsNumber()
  @IsNotEmpty()
  type: number;

  /**
   * @example "husky"
   */
  @IsString()
  @IsNotEmpty()
  breed: string;
}
