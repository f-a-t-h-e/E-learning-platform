import { CourseEnrollment, CourseEnrollmentState } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CoursesEnrollmentEntity implements CourseEnrollment {
  @ApiProperty({
    description: 'Unique identifier for the course enrollment',
    example: 101,
  })
  courseId: number;

  @ApiProperty({
    description: 'Date when the enrollment was created',
    example: '2024-08-17T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Unique identifier for the student',
    example: 202,
  })
  studentId: number;

  @ApiProperty({
    description: 'Date when the enrollment was last updated',
    example: '2024-08-18T14:22:33Z',
  })
  updatedAt: Date;

  
  @ApiProperty({
    description: 'The state of the course enrollment',
    enum: CourseEnrollmentState,
  })
  state: CourseEnrollmentState;
}
