import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  id: string;

  @IsMongoId()
  chatId: string;

  @IsString()
  //   @IsOptional()
  text: string;

  //   @IsArray()
  //   @IsOptional()
  //   attachments?: string[];

  //   @IsOptional()
  //   @IsMongoId()
  //   redirectFromMessageId?: string;

  @IsOptional()
  @IsMongoId()
  replyToMessageId?: string;
}
