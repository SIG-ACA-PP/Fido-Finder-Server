import { users as User } from '@prisma/client';
import { PetDto } from 'src/pet/dto/pet.dto';

export class PostDto {
  id: string;
  pet_id: string;
  author_id: string;
  is_lost: boolean;
  lost_datetime: Date;
  details: string;
  users: User;
  pets: PetDto;
  lost_in?: string | null;
  found_in?: string | null;
}
