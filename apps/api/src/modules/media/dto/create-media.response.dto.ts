import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsString,
  IsUrl,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { $Enums, CourseMedia } from '@prisma/client';

export class CreateMediaResponseDto implements CourseMedia {
  @ApiProperty({ description: 'The size of the media file in bytes' })
  @IsPositive()
  @IsInt()
  bytes: bigint;

  @ApiProperty({
    description: 'The ID of the course associated with the media',
  })
  @IsPositive()
  @IsInt()
  courseId: number;

  @ApiProperty({ description: 'The creation date of the media' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'The file extension of the media' })
  @IsString()
  extension: string;

  @ApiProperty({ description: 'The unique identifier of the media' })
  @IsPositive()
  @IsInt()
  courseMediaId: number;

  @ApiProperty({
    description: 'The target of the media',
    enum: $Enums.CourseMediaTarget,
  })
  @IsEnum($Enums.CourseMediaTarget)
  target: $Enums.CourseMediaTarget;

  @ApiProperty({
    description: 'The ID of the unit associated with the media',
  })
  @IsPositive()
  @IsInt()
  unitId: number;

  @ApiProperty({
    description: 'The ID of the lesson associated with the media',
  })
  @IsPositive()
  @IsInt()
  lessonId: number;

  @ApiProperty({
    description: 'The state of the media',
    enum: $Enums.MediaState,
  })
  @IsEnum($Enums.MediaState)
  state: $Enums.MediaState;

  @ApiProperty({ description: 'The type of media', enum: $Enums.MediaType })
  @IsEnum($Enums.MediaType)
  type: $Enums.MediaType;

  @ApiProperty({ description: 'The last update date of the media' })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({ description: 'The URL of the media' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'The ID of the user who uploaded the media' })
  @IsPositive()
  @IsInt()
  userId: number;
}
