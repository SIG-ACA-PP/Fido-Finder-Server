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
  author_id: string;

  @IsUUID()
  @IsNotEmpty()
  pet_id: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => Point)
  lost_in: Point;

  @IsString()
  @IsNotEmpty()
  details: string;
}
