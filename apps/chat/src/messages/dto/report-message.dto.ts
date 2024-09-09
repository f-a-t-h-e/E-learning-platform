import { IsMongoId, IsString } from 'class-validator';

export class ReportMessageDto {
  @IsMongoId()
  messageId: string;

  @IsMongoId()
  reporterId: string;

  @IsString()
  reason: string;
}
