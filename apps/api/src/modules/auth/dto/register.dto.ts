import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, MinLength } from 'class-validator';
import { CreateUserProfileDto } from '../../user-profile/dto/create-user-profile.dto';
import { AVAILABLE_ROLES } from 'common/constants';

export class RegisterDto extends CreateUserProfileDto {
  @ApiProperty({
    description: 'The user email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password',
    example: 'password123',
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: AVAILABLE_ROLES,
    example: 'student',
  })
  @IsIn(AVAILABLE_ROLES)
  roleName: (typeof AVAILABLE_ROLES)[number];
}
