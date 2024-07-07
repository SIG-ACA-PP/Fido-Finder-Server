import { ApiProperty } from '@nestjs/swagger';
import { users as User } from '@prisma/client';
import { PetDto } from 'src/pet/dto/pet.dto';

/**
 * DTO for creating or updating a post
 */
export class PostDto {
  /**
  * Unique identifier of the post
  * @example "123e4567-e89b-12d3-a456-426614174000"
  */
  id: string;

  /**
   * Unique identifier of the pet
   * @example 855a79d5-362b-4622-8f6d-0016848a686c
   */
  pet_id: string;

  /**
     * Unique identifier of the author
     * @example "456e4567-e89b-12d3-a456-426614174000"
     */
  author_id: string;

  /**
   * Flag indicating if the pet is lost
   * @example true
   */
  is_lost: boolean;

  /**
   * Date and time when the pet was lost
   * @example "2023-07-01T12:34:56Z"
   */
  lost_datetime: Date;

  /**
   * Additional details about the post
   * @example "Last seen near Parque Cuscatlan."
   */
  details: string;

  /**
   * User details
   * @example { "id": "123e4567-e89b-12d3-a456-426614174000", "name": "John Doe" }
   */
  @ApiProperty({ type: () => String })
  users: User;
  pets: PetDto;

  /**
  * Location where the pet was lost
  * @example "Parque Cuscatlan"
  */
  lost_in?: string | null;

  /**
   * Location where the pet was found
   * @example "Parque Bicentenario"
   */
  found_in?: string | null;
}
