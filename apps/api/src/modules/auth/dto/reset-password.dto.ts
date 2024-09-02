import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The old password',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password for the user',
  })
  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}
