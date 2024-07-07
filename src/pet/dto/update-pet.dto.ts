import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


/**
 * DTO for updating pet details
 */
export class UpdatePet {
  /**
   * URL of the pet's image
   * @example "https://example.com/images/pet.jpg"
   */
  img?: string;

  /**
    * Name of the pet
    * @example "Fido"
    */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  /**
   * ID of the pet's color
   * @example 1
   */
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  @IsOptional()
  color_id?: number;


  /**
     * ID of the pet's breed
     * @example 2
     */
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  @IsOptional()
  breed_id?: number;

  /**
   * Description of the pet
   * @example "A friendly and playful dog."
   */
  @IsString()
  @IsOptional()
  description?: string;
}
