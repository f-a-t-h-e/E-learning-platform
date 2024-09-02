import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAccessToken } from '../entities/tokens-payloads';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
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
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      passReqToCallback: false,
    });
  }

  async validate(payload: IAccessToken) {
    return payload;
  }
}
