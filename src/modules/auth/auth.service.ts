import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

const defaultUserSelect = {
  id: true,
  roleName: true,
  name: true,
}
const defaultUserSelectWithPassword = {
  ...defaultUserSelect,
  password: true,
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data:RegisterDto) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: await bcrypt.hash(data.password, 10),
        roleName: data.roleName,
      },
      select: defaultUserSelect
    });
    return user
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
      const { password: _, ...result } = user;
      // @ts-ignore
      result.email = email;
      return result;
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
        id: tokenId,
      },
    });
    const isValid =
      (await bcrypt.compare(refreshToken, session.refreshToken)) &&
      (session.expiresAt > new Date());
    if (isValid) {
      return session;
    }
    return false;
  }
}
