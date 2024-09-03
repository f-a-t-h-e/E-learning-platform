import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export class MediaEntity {
  @ApiProperty({
    description: 'Size of the media file in bytes',
    example: 1024000,
  })
  bytes: bigint;

  @ApiProperty({
    description: 'File extension of the media',
    example: 'jpg',
  })
  extension: string;

  @ApiProperty({
    description: 'URL where the media is stored',
    example: '/uploads/lesson/202/material/752429.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'State of the media (e.g., uploading, uploaded, failed)',
    example: 'uploaded',
    enum: $Enums.MediaState,
  })
  state: $Enums.MediaState;

  @ApiProperty({
    description: 'Type of the media (e.g., image, video, audio)',
    example: 'image',
    enum: $Enums.MediaType,
  })
  type: $Enums.MediaType;

  @ApiProperty({
    description: 'Timestamp when the media was created',
    example: '2024-08-19T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the media was last updated',
    example: '2024-08-19T12:34:56.789Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of the associated user profile',
    example: 10,
  })
  userId: number;
}
