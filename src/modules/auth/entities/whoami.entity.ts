import { ApiProperty } from '@nestjs/swagger';
import { RequestUser } from './request-user.entity';

export class Whoami {
  @ApiProperty({
    description: 'The user object',
    type: RequestUser,
  })
  user: RequestUser;
}
