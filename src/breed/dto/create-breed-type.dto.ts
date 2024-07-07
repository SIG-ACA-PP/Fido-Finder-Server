import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBreedType {
  /**
   * @example "husky"
   */
  @IsString()
  @IsNotEmpty()
  type: string;
}
