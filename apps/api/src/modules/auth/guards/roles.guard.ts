import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { RequestUser } from '../entities/request-user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Extract the JWT using the same logic as the JwtStrategy
    const token =
      request.cookies?.access ||
      request.headers['authorization']?.split(' ')[1] ||
      request.headers['access-token'];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify the token and retrieve the payload
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      request.user = {
        roleName: payload.roleName,
        userId: payload.userId,
        username: payload.username,
      } as RequestUser;

      // Check if the user has the required role
      return requiredRoles.some((roleName) => payload.roleName === roleName);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
