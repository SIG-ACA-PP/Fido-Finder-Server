import { Type } from 'class-transformer';
import {
  IsDefined,
  ValidateNested,
} from 'class-validator';
import { Point } from 'src/models';

export class UpdatePost {
  @IsDefined()
  @ValidateNested()
  @Type(() => Point)
  found_in: Point;
}
