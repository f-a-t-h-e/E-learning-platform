import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email address to send the password reset link to',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
