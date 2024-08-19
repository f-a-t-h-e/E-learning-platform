import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { CreateUserProfileDto } from 'src/modules/user-profile/dto/create-user-profile.dto';

const AVAILABLE_ROLES = ['student', 'teacher'] as const;

// Define options for the 'roleName' property
const roleNameOptions: ApiPropertyOptions = {
  description: 'The role of the user',
  enum: AVAILABLE_ROLES,
  example: 'student', // Example of a role
};

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
  @IsNotEmpty()
  password: string;

  @ApiProperty(roleNameOptions)
  @IsIn(AVAILABLE_ROLES)
  roleName: (typeof AVAILABLE_ROLES)[number];
}
