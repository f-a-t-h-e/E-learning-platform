import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateCourseEnrollmentDto {
  @ApiProperty({
    description:
      'The unique identifier of the course for which you want to enroll in.',
    example: 101,
  })
  @IsNumber()
  courseId: number;
}
