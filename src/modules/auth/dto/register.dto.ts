import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';

const AVAILABLE_ROLES = ['student', 'teacher'] as const;

// Define options for the 'roleName' property
const roleNameOptions: ApiPropertyOptions = {
  description: 'The role of the user',
  enum: AVAILABLE_ROLES,
  example: 'student', // Example of a role
};

export class RegisterDto {
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

  @ApiProperty({
    description: 'The user name',
    example: 'John Doe',
  })
  @MinLength(3)
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty(roleNameOptions)
  @IsIn(AVAILABLE_ROLES)
  roleName: (typeof AVAILABLE_ROLES)[number];
}
