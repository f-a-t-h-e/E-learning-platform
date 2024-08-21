import { Response } from 'express';
import {
  ACCESS_TOKEN_AGE,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_AGE,
  REFRESH_TOKEN_NAME,
} from 'src/config/cookies.config';

export function setAccessAndRefreshCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie(ACCESS_TOKEN_NAME, accessToken, {
    secure: true,
    httpOnly: true,
    maxAge: ACCESS_TOKEN_AGE,
    sameSite: 'strict',
  });
  res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
    secure: true,
    httpOnly: true,
    maxAge: REFRESH_TOKEN_AGE,
    sameSite: 'strict',
  });
}
