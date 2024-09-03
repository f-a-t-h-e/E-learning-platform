import { Injectable } from '@nestjs/common';
import { PrismaService } from 'common/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RequestUser } from './entities/request-user.entity';
import { ConfigService } from '@nestjs/config';

const defaultUserSelect = {
  userId: true,
  roleName: true,
  // name: true,
};
const defaultUserSelectWithPassword = {
  ...defaultUserSelect,
  password: true,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async register(data: RegisterDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: await this.hashPassword(data.password),
          roleName: data.roleName,
          profile: {
            create: {
              username: data.username,
              firstName: data.firstName,
              lastName: data.lastName,
              secondName: data.secondName,
              thirdName: data.thirdName,
              bio: data.bio,
              photo: data.photo,
              phone: data.phone,
            },
          },
        },
        select: defaultUserSelect,
      });
      return { ...user, username: data.username };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          if ((error.meta.target as Array<string>).includes('email')) {
            return 'email';
          }
          if ((error.meta.target as Array<string>).includes('username')) {
            return 'username';
          }
        }
      }
      throw error;
    }
  }

  async validateUserLogin(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
      select: defaultUserSelectWithPassword,
    });
    if (!user) {
      return null;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      delete user.password;
      // @ts-expect-error : I don't want to return a new object so I am reuasing it
      user.email = email;
      return user;
    }
    return false;
  }

  getCookieWithJwtAccessToken(payload: RequestUser) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_LIFE'),
    });
    return token;
  }

  getCookieWithJwtRefresgToken(payload: RequestUser) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_LIFE'),
    });
    return token;
  }

  async validateRefreshToken(refreshToken: string, tokenId: number) {
    const session = await this.prisma.session.findFirst({
      where: {
        sessionId: tokenId,
      },
    });
    const isValid =
      (await bcrypt.compare(refreshToken, session.refreshToken)) &&
      session.expiresAt > new Date();
    if (isValid) {
      return session;
    }
    return false;
  }

  async verifyEmail(userId: number) {
    await this.prisma.user.update({
      where: { userId: userId },
      data: {
        emailVerified: 'verified',
      },
      select: {
        userId: true,
      },
    });
  }

  async getUserById(userId: number) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { userId: userId },
      select: {
        email: true,
        emailVerified: true,
        roleName: true,
        profile: {
          select: {
            username: true,
          },
        },
      },
    });
  }
  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        email: true,
        emailVerified: true,
        roleName: true,
        profile: {
          select: {
            username: true,
          },
        },
      },
    });
    return user;
  }

  async setPassword(
    condition:
      | { userId: number; email?: string }
      | { userId?: number; email: string },
    newPassword: string,
  ) {
    return await this.prisma.user.update({
      where: condition,
      data: {
        password: await this.hashPassword(newPassword),
      },
    });
  }
}
