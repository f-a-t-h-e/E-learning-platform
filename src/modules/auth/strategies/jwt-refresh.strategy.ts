import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IRefreshToken } from '../entities/tokens-payloads';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh || request.headers['refresh-token'];
        },
      ]),
      secretOrKey: '1234',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: IRefreshToken) {
    const refreshToken =
      request.cookies?.refresh || request.headers['refresh-token'];
    return this.authService.validateRefreshToken(refreshToken, payload.id);
  }
}
