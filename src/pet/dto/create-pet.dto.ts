import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePet {
  /**
  * Unique identifier of the owner
  * @example "456e4567-e89b-12d3-a456-426614174000"
  */
  owner_id: string;

  /**
   * URL of the pet's image
   * @example "https://example.com/images/pet.jpg"
   */
  img: string | null;

  /**
   * Name of the pet
   * @example "Fido"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

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
