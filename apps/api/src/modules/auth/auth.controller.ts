import {
  Controller,
  Get,
  Post,
  HttpCode,
  UseGuards,
  Req,
  Body,
  HttpStatus,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { User } from '../../common/decorators/user.decorator';
import { Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import JwtGuard from './guards/jwt.guard';
import { AuthRes } from './entities/auth-res.entity';
import { RequestUser } from './entities/request-user.entity';
import { Whoami } from './entities/whoami.entity';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { UnauthorizedResponse } from '../../common/entities/error-response.entity';
import { LoginDto } from './dto/login.dto';
import { setAccessAndRefreshCookies } from './utils/setAccessAndRefreshCookies';
import { TaskSchedulerService } from '../task-scheduler/task-scheduler.service';
import { Channels_Enum } from 'common/enums/channels.enum';
import { OtpPurpose, OtpService } from 'common/services/otp.service';
import {
  EmailVerificationActions,
  EmailVerificationDto,
} from './dto/email-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordByTokenDto } from './dto/reset-password-by-token.dto';

@ApiErrorResponses()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly taskSchedulerService: TaskSchedulerService,
    private readonly otpService: OtpService,
  ) {}

  @ApiOperation({
    summary: 'Register new user',
    description: `Register a new user in the platform using email and password`,
  })
  @ApiResponse({
    type: AuthRes,
    status: HttpStatus.CREATED,
    description: `The new user is registered successfully`,
  })
  @ApiConflictResponse({
    example: {
      message: 'There is a user with this email already!',
      error: 'Conflict',
      statusCode: 409,
    },
    status: HttpStatus.CONFLICT,
    description: `There is a user with this email`,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() registrationData: RegisterDto,
    @Req() req: Request,
  ): Promise<AuthRes> {
    const user = await this.authService.register(registrationData);
    if (user == 'email') {
      throw new ConflictException(`There is a user with this email already!`);
    }
    if (user == 'username') {
      throw new ConflictException(
        `There is a user with this username already!`,
      );
    }
    // Manage token
    const accessToken = this.authService.getCookieWithJwtAccessToken(user);
    const refreshToken = this.authService.getCookieWithJwtRefresgToken(user);

    setAccessAndRefreshCookies(req.res, accessToken, refreshToken);

    await this.taskSchedulerService.scheduleUniqueEvent({
      event: {
        channel: Channels_Enum.user_created,
        data: {
          email: registrationData.email,
          roleName: user.roleName,
          username: registrationData.username,
          userId: user.userId,
        },
      },
      triggerTime: 0,
      taskId: `verify-email:${user.userId}`,
    });
    /**
     * @todo Save the session
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
  @ApiBody({
    required: true,
    type: LoginDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: RequestUser, @Req() req: Request): AuthRes {
    // Manage token
    const accessToken = this.authService.getCookieWithJwtAccessToken(user);
    const refreshToken = this.authService.getCookieWithJwtRefresgToken(user);

    setAccessAndRefreshCookies(req.res, accessToken, refreshToken);

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
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Get('whoami')
  whoami(@User() user: RequestUser): Whoami {
    return {
      user,
    };
  }

  @Post('verify-email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify email address' })
  @ApiBody({
    description: 'Email verification data',
    type: EmailVerificationDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Email verification successful',
    schema: {
      example: { success: true },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid data or OTP',
    schema: {
      example: { success: false },
    },
  })
  @UseGuards(JwtGuard)
  async verifyEmail(
    @User() user: RequestUser,
    @Body() data: EmailVerificationDto,
  ) {
    if (data.action == EmailVerificationActions['submit-otp']) {
      const result = await this.otpService.validateOtp(
        user.userId,
        OtpPurpose.EMAIL_VERIFICATION,
        data.otp,
      );
      if (result.status == 'success') {
        await this.authService.verifyEmail(user.userId);
        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    }
    // @todo Add rate limiting to sending new emails
    const userData = await this.authService.getUserById(user.userId);
    await this.taskSchedulerService.scheduleUniqueEvent({
      event: {
        channel: Channels_Enum.user_created,
        data: {
          email: userData.email,
          roleName: userData.roleName,
          username: userData.profile.username,
          userId: user.userId,
        },
      },
      triggerTime: 0,
      taskId: `verify-email:${user.userId}`,
    });

    return {
      success: true,
    };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset link' })
  @ApiBody({
    description: 'Forgot password request data',
    type: ForgotPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset link sent successfully',
    schema: {
      example: { success: true },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid data',
    schema: {
      example: { success: false },
    },
  })
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    const user = await this.authService.getUserByEmail(data.email);
    if (!user) {
      return 'OK';
    }
    await this.taskSchedulerService.scheduleUniqueEvent({
      event: {
        channel: Channels_Enum.forgot_password,
        data: {
          email: user.email,
          roleName: user.roleName,
          username: user.profile.username,
          userId: user.userId,
        },
      },
      triggerTime: 0,
      taskId: `forgot-password:${user.userId}`,
    });
    return 'OK';
  }

  @Post('forgot-password-reset')
  async forgotPasswordReset(
    @Body() resetPasswordByTokenDto: ResetPasswordByTokenDto,
  ) {
    const result = await this.otpService.validateOtp(
      resetPasswordByTokenDto.email,
      OtpPurpose.FORGOT_PASSWORD,
      resetPasswordByTokenDto.token,
    );

    if (result.status == 'failure') {
      throw new BadRequestException(`Invalid Otp`);
    }

    await this.authService.setPassword(
      { email: resetPasswordByTokenDto.email },
      resetPasswordByTokenDto.newPassword,
    );
    return 'OK';
  }
}
