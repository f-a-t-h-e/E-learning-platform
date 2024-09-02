import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MailingService } from './mailing.service';
import { OtpPurpose, OtpService } from 'common/services/otp.service';
import { Channels_Enum } from 'common/enums/channels.enum';
import { UserCreatedEventPayloadEntity } from 'common/entities/user-created-event.entity';
import { ForgotPasswordEventDataEntity } from 'common/entities/forgot-password-event.entity';

@Controller()
export class MailingController {
  constructor(
    private readonly mailingService: MailingService,
    private readonly otpService: OtpService,
  ) {}

  @EventPattern(Channels_Enum.user_created)
  async sendEmailVerification(data: UserCreatedEventPayloadEntity) {
    const otp = await this.otpService.generateOtp(
      data.userId,
      OtpPurpose.EMAIL_VERIFICATION,
    );
    await this.mailingService.sendEmailVerification(
      {
        otp: otp,
        username: `@${data.username}`,
      },
      data.email,
    );
    console.log(`sent email`);
  }

  @EventPattern(Channels_Enum.forgot_password)
  async sendForgotPasswordOtp(data: ForgotPasswordEventDataEntity) {
    const otp = await this.otpService.generateOtp(
      data.email,
      OtpPurpose.FORGOT_PASSWORD,
    );
    await this.mailingService.sendForgotPasswordOtp(
      {
        otp: otp,
        username: `@${data.username}`,
      },
      data.email,
    );
    console.log(`sent email for resetting password`);
  }
}
