import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({
    description: `The courseId that you want to relate this media to`,
    nullable: true,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false })
  courseId?: number;

  @ApiProperty({
    description: `The lessonId that you want to relate this media to`,
    nullable: true,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false })
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
}
