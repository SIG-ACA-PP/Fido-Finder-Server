import { IsUUID } from 'class-validator';

export class UUID {
  @IsUUID()
  id: string;
}
