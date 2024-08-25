import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RequestUser } from './entities/request-user.entity';

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
  ) {}

  async register(data: RegisterDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: await bcrypt.hash(data.password, 10),
          roleName: data.roleName,
          profile: {
            create: {
              username: data.username,
              firstName: data.firstName,
              lastName: data.lastName,
              secondName: data.secondName,
              thirdName: data.thirdName,
              bio: data.bio,
              avatar: data.avatar,
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
      secret: '123',
      expiresIn: `1h`,
    });
    return token;
  }
  getCookieWithJwtRefresgToken(payload: RequestUser) {
    const token = this.jwtService.sign(payload, {
      secret: '1234',
      expiresIn: `12h`,
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
}
