import {
  Controller,
  Get,
  Post,
  HttpCode,
  UseGuards,
  Req,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { Request } from 'express';
import { RegisterDto } from './dto/register.dto';

const accessTokenAge = 1000 * 60 * 60 * 1;
const refreshTokenAge = 1000 * 60 * 60 * 12;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registrationData: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(registrationData);

    // Manage token
    const accessToken = this.authService.getCookieWithJwtAccessToken(user);
    const refreshToken = this.authService.getCookieWithJwtRefresgToken(user);
    req.res.cookie('access', accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: accessTokenAge,
    });
    req.res.cookie('refresh', refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: refreshTokenAge,
    });

    /**
     * @todo Confirm email
     */

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: RequestUser, @Req() req: Request) {
    // Manage token
    const accessToken = this.authService.getCookieWithJwtAccessToken(user);
    const refreshToken = this.authService.getCookieWithJwtRefresgToken(user);
    req.res.cookie('access', accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: accessTokenAge,
    });
    req.res.cookie('refresh', refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: refreshTokenAge,
    });
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Get('whoami')
  whoami(@User() user: RequestUser) {
    return {
      user,
    };
  }
}
