import { ApiProperty } from '@nestjs/swagger';

export class RequestUser {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the user',
    example: 'Mohammed Ahmed',
  })
  name: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'teacher',
  })
  roleName: string;
}
