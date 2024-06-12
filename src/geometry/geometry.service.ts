import { Injectable } from '@nestjs/common';
import { Point } from 'src/models';

@Injectable()
export class GeometryService {
  createDBPoint(point: Point): string {
    return `POINT(${point.lon} ${point.lat})`;
  }
}
