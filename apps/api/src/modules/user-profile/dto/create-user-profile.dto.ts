import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class CreateUserProfileDto {
  @ApiProperty({
    description: 'The username that will be unique for your account',
    example: 'mohammed1',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => (value as string).trim().toLowerCase())
  username: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Mohammed',
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Second name of the user (optional)',
    example: 'Ahmed',
    required: false,
  })
  @IsOptional()
  @IsString()
  secondName?: string;

  @ApiProperty({
    description: 'Third name of the user (optional)',
    example: 'Mostafa',
    required: false,
  })
  @IsOptional()
  @IsString()
  thirdName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Mahmoud',
    required: true,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Short biography of the user',
    example: 'Software developer with 5 years of experience',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: "URL of the user's avatar",
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+201234567890',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;
}
