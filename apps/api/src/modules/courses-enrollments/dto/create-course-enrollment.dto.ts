import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateCourseEnrollmentDto {
  @ApiProperty({
    description:
      'The unique identifier of the course for which you want to enroll in.',
    example: 101,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  courseId: number;
}
