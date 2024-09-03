import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { MediaPurposeEnum } from '../media-purpose.enum';

export class CompleteMediaDto {
  @ApiProperty({
    description: 'The unique identifier of the media',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'The purpose of the media',
    example: MediaPurposeEnum.course_banner,
    enum: MediaPurposeEnum,
  })
  @IsEnum(MediaPurposeEnum)
  purpose: keyof MediaPurposeEnum;
}
