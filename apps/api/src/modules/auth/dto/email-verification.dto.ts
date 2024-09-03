import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, MinLength } from 'class-validator';
import { OTP_LENGTH } from 'common/constants';

export enum EmailVerificationActions {
  'submit-otp' = 'submit-otp',
  'resend-otp' = 'resend-otp',
}
export class EmailVerificationDto {
  @ApiProperty({
    description: `The action that you want to do.`,
    enum: EmailVerificationActions,
    example: EmailVerificationActions['submit-otp'],
  })
  @IsEnum(EmailVerificationActions)
  action: EmailVerificationActions;

  @ApiProperty({
    description: `The otp sent to your mailbox.`,
    required: false,
  })
  @IsOptional()
  @MinLength(OTP_LENGTH)
  otp?: string;
}
