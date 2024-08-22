import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class RequestUser {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'The username of the user',
    example: 'mohammed123',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'teacher',
  })
  @IsString()
  roleName: string;
}
