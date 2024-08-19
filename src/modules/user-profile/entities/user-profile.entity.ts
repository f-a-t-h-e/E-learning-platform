import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '@prisma/client';

export class UserProfileEntity implements UserProfile {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the user profile.',
  })
  userId: number;

  @ApiProperty({
    example: 'mohammed1',
    uniqueItems: true,
    description: 'The username of the user profile. Must be unique.',
  })
  username: string;

  @ApiProperty({
    example: 'Mohammed',
    description: 'The first name of the user.',
  })
  firstName: string;

  @ApiProperty({
    example: 'Ahmed',
    required: false,
    description: 'The second name of the user. This field can be null.',
  })
  secondName: string | null;

  @ApiProperty({
    example: 'Mostafa',
    required: false,
    description: 'The third name of the user. This field can be null.',
  })
  thirdName: string | null;

  @ApiProperty({
    example: 'Mahmoud',
    description: 'The last name of the user.',
  })
  lastName: string;

  @ApiProperty({
    example: 'Software developer with 5 years of experience',
    required: false,
    description: 'A brief biography of the user. This field can be null.',
  })
  bio: string | null;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    required: false,
    description: "The URL of the user's avatar image. This field can be null.",
  })
  avatar: string | null;

  @ApiProperty({
    description: 'URL where the user profile banner is stored',
    example: '/uploads/profile/34/100/banner/4234.jpg',
    nullable: true,
  })
  banner: string | null;

  @ApiProperty({
    example: '+1234567890',
    required: false,
    description: 'The phone number of the user. This field can be null.',
  })
  phone: string | null;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'The date and time when the user profile was created.',
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'The date and time when the user profile was last updated.',
  })
  updatedAt: Date;
}
