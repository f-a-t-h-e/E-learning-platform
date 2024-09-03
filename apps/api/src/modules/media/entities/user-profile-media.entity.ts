import { ApiProperty } from '@nestjs/swagger';
import { $Enums, UserProfileMedia } from '@prisma/client';
import { MediaEntity } from './media.entity';

export class UserProfileMediaEntity
  extends MediaEntity
  implements UserProfileMedia
{
  @ApiProperty({
    description: 'Unique identifier for the media',
    example: 1,
  })
  userProfileMediaId: number;

  @ApiProperty({
    description: 'Purpose of the media (e.g., profile_banner, profile_photo)',
    example: 'profile_photo',
    enum: $Enums.UserProfileMediaPurpose,
  })
  purpose: $Enums.UserProfileMediaPurpose;
}
