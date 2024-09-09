import { IsMongoId, IsString } from 'class-validator';

export class AddReactionDto {
  @IsMongoId()
  messageId: string;

  @IsString()
  reaction: string;  // e.g., "like", "love", etc.
}
