import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { customAlphabet } from 'nanoid';

import { preserveTTLOnUpdateForRedis } from 'common/utils/preserve-ttl-on-update-for-redis';

import { OTP_LENGTH } from 'common/constants';

const nanoid = customAlphabet('0123456789', OTP_LENGTH);

export enum OtpPurpose {
  EMAIL_VERIFICATION = 'email-verification',
  FORGOT_PASSWORD = 'forgot-password',
}

export interface OtpDetails {
  code: string;
  purpose: OtpPurpose;
  tries: number;
}

@Injectable()
export class OtpService {
  private readonly otpExpiry = 300; // OTP expiry time in seconds (e.g., 5 minutes)
  private readonly maxTries = 3; // Maximum number of tries allowed

  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getOtpKey(id: string | number, purpose: OtpPurpose): string {
    return `otp:${id}:${purpose}`;
  }

  async generateOtp(id: string | number, purpose: OtpPurpose): Promise<string> {
    const otpCode = nanoid();
    const otpDetails: OtpDetails = {
      code: otpCode,
      purpose,
      tries: 0,
    };

    const otpKey = this.getOtpKey(id, purpose);
    await this.redis.set(
      otpKey,
      JSON.stringify(otpDetails),
      'EX',
      this.otpExpiry,
    );

    return otpCode;
  }

  async validateOtp(id: string | number, purpose: OtpPurpose, otpCode: string) {
    const otpKey = this.getOtpKey(id, purpose);
    const otpData = await this.redis.get(otpKey);

    if (!otpData) {
      return {
        status: 'failure' as 'failure',
        message:
          'OTP has expired or does not exist.' as 'OTP has expired or does not exist.',
      };
    }

    const otpDetails: OtpDetails = JSON.parse(otpData);

    if (otpDetails.tries >= this.maxTries) {
      return {
        status: 'failure' as 'failure',
        message:
          'Maximum OTP attempts reached.' as 'Maximum OTP attempts reached.',
      };
    }

    if (otpDetails.code !== otpCode) {
      otpDetails.tries += 1;
      await preserveTTLOnUpdateForRedis(
        this.redis,
        otpKey,
        JSON.stringify(otpDetails),
      );

      return {
        status: 'failure' as 'failure',
        message: 'Invalid OTP.' as 'Invalid OTP.',
      };
    }

    // OTP is valid, remove it from Redis
    await this.redis.del(otpKey);
    return {
      status: 'success' as 'success',
      data: otpDetails,
    };
  }

  //   async invalidateOtp(userId: string, purpose: OtpPurpose): Promise<void> {
  //     const otpKey = this.getOtpKey(userId, purpose);
  //     await this.redis.del(otpKey);
  //   }
}
