import { colors as Color } from '@prisma/client';
import { breeds as Breed } from '@prisma/client';

export class PetDto {
  id: string;
  owner_id: string;
  name: string;
  color_id: number;
  breed_id: number;
  description: string;
  colors: Color;
  breeds: Breed;
}
