import { IsUUID } from 'class-validator';

export class DeleteSeenReport {
  @IsUUID()
  postId: string;

  @IsUUID()
  seenId: string;
}
