import { IsInt, IsString } from 'class-validator';

export class RequestChatDto {
  @IsInt()
  userId: number;

  @IsString()
  purpose: string;
}
