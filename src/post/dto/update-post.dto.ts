import { Type } from 'class-transformer';
import {
  IsDefined,
  ValidateNested,
} from 'class-validator';
import { Point } from 'src/models';

export class UpdatePost {
  /**
   * Location where the pet was found
   * @example {lon: 89.1874461  lat:-13.487516587}
   */
  @IsDefined()
  @ValidateNested()
  @Type(() => Point)
  found_in: Point;
}
