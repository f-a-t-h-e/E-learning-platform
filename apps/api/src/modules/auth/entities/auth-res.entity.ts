import { ApiProperty } from '@nestjs/swagger';
import { RequestUser } from '../../../../../../common/entities/request-user.entity';

export class AuthRes {
  @ApiProperty({
    description: 'A JWT token that you can use as access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOjEsIm5hbWUiOiJNb2hhbW1lZCBBaG1lZCIsInJvbGVOYW1lIjoidGVhY2hlciIsImlhdCI6MTUxNjIzOTAyMn0.0mlmFF30wfn-hfwHOyE7O8O34328oZEmwXVmnJhas6k',
  })
  accessToken: string;
  @ApiProperty({
    description: 'A JWT token that you can use as refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOjEsIm5hbWUiOiJNb2hhbW1lZCBBaG1lZCIsInJvbGVOYW1lIjoidGVhY2hlciIsImlhdCI6MTUxNjIzOTAyMn0.hnXcw1xisGjeVF1rzK1C9zGNoEY625foqqSx8nfLifA',
  })
  refreshToken: string;
  @ApiProperty({
    description: 'The user object',
    type: RequestUser,
  })
  user: RequestUser;
}
