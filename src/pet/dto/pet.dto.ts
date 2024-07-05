import { ApiProperty } from '@nestjs/swagger';
import { colors as Color } from '@prisma/client';
import { breeds as Breed } from '@prisma/client';

export class PetDto {
  /**
   * @example 855a79d5-362b-4622-8f6d-0016848a686c
   */
  id: string;

  /**
   * @example a8d7e899-53c3-4bbb-ab69-f7d2ba5c24bd
   */
  owner_id: string;

  /**
   * @example Fido
   */
  name: string;

  /**
   * @example 2
   */
  color_id: number;

  /**
   * @example 4
   */
  breed_id: number;

  /**
   * @example 'A really friendly and adorable puppy'
   */
  description: string;


  @ApiProperty({ type: () => String })
  colors: Color;
  @ApiProperty({ type: () => String })
  breeds: Breed;
}
