import { ApiProperty } from '@nestjs/swagger';
import { $Enums, CourseMedia } from '@prisma/client';
import { MediaEntity } from './media.entity';

export class CourseMediaEntity extends MediaEntity implements CourseMedia {
  @ApiProperty({
    description: 'Unique identifier for the media',
    example: 1,
  })
  courseMediaId: number;

  @ApiProperty({
    description: 'Purpose of the media (e.g., course_banner, course_material)',
    example: 'course_material',
    enum: $Enums.CourseMediaPurpose,
  })
  purpose: $Enums.CourseMediaPurpose;

  @ApiProperty({
    description: 'ID of the associated course',
    example: 1,
  })
  courseId: number;
}
