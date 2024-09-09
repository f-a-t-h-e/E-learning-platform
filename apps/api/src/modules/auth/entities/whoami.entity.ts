import { ApiProperty } from '@nestjs/swagger';
import { RequestUser } from '../../../../../../common/entities/request-user.entity';
import { Type } from 'class-transformer';

export class Whoami {
  @ApiProperty({
    description: 'The user object',
    type: RequestUser,
  })
  @Type(() => RequestUser)
  user: RequestUser;
}
