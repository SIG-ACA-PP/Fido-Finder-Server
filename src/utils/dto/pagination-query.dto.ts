import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  take?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  skip?: number;
}
