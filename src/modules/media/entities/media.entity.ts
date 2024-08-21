import { $Enums, CourseMedia } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsDate,
} from 'class-validator';

export class CourseMediaEntity implements CourseMedia {
  @ApiProperty({
    description: 'Unique identifier for the media',
    example: 1,
  })
  @IsNumber()
  courseMediaId: number;

  @ApiProperty({
    description: 'Size of the media file in bytes',
    example: 1024000,
  })
  @IsNumber()
  bytes: bigint;

  @ApiProperty({
    description: 'File extension of the media',
    example: 'jpg',
  })
  @IsString()
  extension: string;

  @ApiProperty({
    description: 'URL where the media is stored',
    examples: [
      '/uploads/profile/15/78031/banner/752429.jpg',
      '/uploads/course/2/14206/banner/752429.jpg',
      '/uploads/course/2/14206/unit/3129981/banner/752429.jpg',
      '/uploads/course/2/14206/unit/3129981/lesson/8461193702/banner/752429.jpg',
    ],
    format: `/uploads/(<entity>/<part-number>/<entity-id>)[]/<target>/<media-id>`,
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'State of the media (e.g., ACTIVE, INACTIVE)',
    example: 'ACTIVE',
    enum: $Enums.MediaState,
  })
  @IsEnum($Enums.MediaState)
  state: $Enums.MediaState;

  @ApiProperty({
    description:
      'Target audience or purpose of the media (e.g., STUDENT, INSTRUCTOR)',
    example: 'STUDENT',
    enum: $Enums.CourseMediaTarget,
  })
  @IsEnum($Enums.CourseMediaTarget)
  target: $Enums.CourseMediaTarget;

  @ApiProperty({
    description: 'Type of the media (e.g., IMAGE, VIDEO, AUDIO)',
    example: 'IMAGE',
    enum: $Enums.MediaType,
  })
  @IsEnum($Enums.MediaType)
  type: $Enums.MediaType;

  @ApiProperty({
    description: 'Timestamp when the media was created',
    example: '2024-08-19T12:34:56.789Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the media was last updated',
    example: '2024-08-19T12:34:56.789Z',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of the associated profile',
    example: 10,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'ID of the associated course, if any',
    example: 101,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  courseId: number | null;

  @ApiProperty({
    description: 'ID of the associated lesson, if any',
    example: 202,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  lessonId: number | null;

  @ApiProperty({
    description: 'ID of the associated unit, if any',
    example: 303,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  unitId: number | null;
}
