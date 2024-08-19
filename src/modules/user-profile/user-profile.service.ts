import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserProfile } from '@prisma/client';

@Injectable()
export class UserProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUserProfile(
    userId: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('User profile not found');
    }

    this.prisma.userProfile.updateMany({
      where: { userId },
      data: updateUserProfileDto,
    });

    return {
      ...existingProfile,
      ...updateUserProfileDto,
    };
  }

  async getUserProfile(userId: number) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  async updateAvatar(id: UserProfile['userId'], url: string) {
    await this.prisma.userProfile.updateMany({
      where: {
        userId: id,
      },
      data: {
        avatar: url,
      },
    });
    // @todo You can do some notification in case you want to get closer to a social media platform
  }
  async updateBanner(id: UserProfile['userId'], url: string) {
    await this.prisma.userProfile.updateMany({
      where: {
        userId: id,
      },
      data: {
        banner: url,
      },
    });
    // @todo You can do some notification in case you want to get closer to a social media platform
  }
}
