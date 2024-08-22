import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAccessToken } from '../entities/tokens-payloads';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return (
            request?.cookies?.access ||
            request.headers['authorization']?.split(' ')[1] ||
            request.headers['access-token']
          );
        },
      ]),
      secretOrKey: '123',
      passReqToCallback: false,
    });
  }

  async validate(payload: IAccessToken) {
    return payload;
  }
}
