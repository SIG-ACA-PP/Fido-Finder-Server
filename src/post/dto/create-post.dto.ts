import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Point } from 'src/models';

export class CreatePost {
  /**
   * @example a8d7e899-53c3-4bbb-ab69-f7d2bsafdw75as
   */
  author_id: string;

  /**
   * @example 855a79d5-362b-4622-8f6d-0016848a686c
   */
  @IsUUID()
  @IsNotEmpty()
  pet_id: string;

  /**
  * Location where the pet was lost
  * @example "Parque Cuscatlan"
  */
  @IsDefined()
  @ValidateNested()
  @Type(() => Point)
  lost_in: Point;

  /**
   * Additional details about the post
   * @example "Last seen near Parque Cuscatlan."
   */
  @IsString()
  @IsNotEmpty()
  details: string;
}
