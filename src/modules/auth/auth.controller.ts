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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import JwtGuard from './guards/jwt.guard';
import { AuthRes } from './entities/auth-res.entity';
import { RequestUser } from './entities/request-user.entity';
import { Whoami } from './entities/whoami.entity';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { UnauthorizedResponse } from 'src/common/entities/error-response.entity';

const accessTokenAge = 1000 * 60 * 60 * 1;
const refreshTokenAge = 1000 * 60 * 60 * 12;

@ApiErrorResponses()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register new user',
    description: `Register a new user in the platform using email and password`,
  })
  @ApiResponse({
    type: AuthRes,
    status: HttpStatus.CREATED,
    description: `The new user is registered successfully`,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() registrationData: RegisterDto,
    @Req() req: Request,
  ): Promise<AuthRes> {
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

  @ApiOperation({
    summary: 'Login',
    description: `Login using email and password`,
  })
  @ApiResponse({
    type: AuthRes,
    status: HttpStatus.OK,
    description: `The user logged in successfully`,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: RequestUser, @Req() req: Request): AuthRes {
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

  @ApiOperation({
    summary: 'Get your user data',
    description: `Get the user data from the cookie (useful for web)`,
  })
  @ApiResponse({
    type: Whoami,
    status: HttpStatus.OK,
    description: 'User is logged in and you got the user details',
  })
  @ApiResponse({
    status: 401,
    description: 'User is not logged in (you need to login first)',
    type: UnauthorizedResponse,
  })
  @ApiResponse({
    status: 400,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Get('whoami')
  whoami(@User() user: RequestUser): Whoami {
    return {
      user,
    };
  }
}
