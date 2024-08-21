import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RequestUser {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'The name of the user',
    example: 'Mohammed Ahmed',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'teacher',
  })
  @IsString()
  roleName: string;
}
