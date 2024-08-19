import { ApiProperty } from '@nestjs/swagger';
import { MediaTarget, MediaType } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({
    description: `The courseId that you want to relate this media to`,
    nullable: true,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false })
  @Min(1)
  courseId?: number;

  @ApiProperty({
    description: `The unitId that you want to relate this media to`,
    nullable: true,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false })
  @Min(1)
  unitId?: number;

  @ApiProperty({
    description: `The lessonId that you want to relate this media to`,
    nullable: true,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false })
  @Min(1)
  lessonId?: number;

  @ApiProperty({
    description: `The type of the media that you want to upload`,
    nullable: false,
    type: MediaType,
    example: MediaType.IMAGE,
    enum: MediaType,
  })
  @IsIn(Object.values(MediaType))
  type: MediaType;

  @ApiProperty({
    description: `The extension of the media that you want to upload`,
    nullable: false,
    type: String,
    example: 'png',
  })
  @IsString()
  extension: string;

  @ApiProperty({
    enum: MediaTarget,
    description: 'The target location for the media file',
    example: MediaTarget.PROFILE_PICTURE,
  })
  @IsEnum(MediaTarget)
  target: MediaTarget;
}
