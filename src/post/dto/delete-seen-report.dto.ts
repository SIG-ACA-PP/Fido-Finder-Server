import { IsUUID } from 'class-validator';

export class DeleteSeenReport {
  /**
   * @example ce1044fb-5bd4-4ce7-bcbe-b9e84d4ea2cc
   */
  @IsUUID()
  postId: string;

  /**
   * @example 01908486-e6a8-76c0-805f-f6d0593f3fa8
   */
  @IsUUID()
  seenId: string;
}
