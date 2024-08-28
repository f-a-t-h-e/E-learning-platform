import { ApiProperty } from '@nestjs/swagger';
import { CourseMediaTarget, MediaType } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsInt,
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
  @IsInt()
  @Min(1)
  courseId?: number;

  @ApiProperty({
    description: `The unitId that you want to relate this media to`,
    nullable: true,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  unitId?: number;

  @ApiProperty({
    description: `The lessonId that you want to relate this media to`,
    nullable: true,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  lessonId?: number;

  @ApiProperty({
    description: `The type of the media that you want to upload`,
    nullable: false,
    type: MediaType,
    example: MediaType.image,
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
    enum: CourseMediaTarget,
    description: 'The target location for the media file',
    example: CourseMediaTarget.course_banner,
  })
  @IsEnum(CourseMediaTarget)
  target: CourseMediaTarget;
}
