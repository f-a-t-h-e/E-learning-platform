import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from './entities/request-user.entity';

// export type RequestUser = {
//   id: number;
//   password: string;
//   name: string;
//   roleName: string;
// }

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as RequestUser;
  },
);
