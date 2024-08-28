import { CourseEnrollment, CourseEnrollmentState } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CoursesEnrollmentEntity implements CourseEnrollment {
  @ApiProperty({
    description: 'The unique identifier of the course enrollment',
  })
  courseEnrollmentId: number;

  @ApiProperty({
    description: 'Unique identifier for the course enrollment',
    example: 101,
  })
  courseId: number;

  @ApiProperty({
    description: 'Unique identifier for the student',
    example: 202,
  })
  studentId: number;

  @ApiProperty({
    description:
      'The current grade collected by the student from quizzes in this course enrollment',
    example: 345,
    minimum: 0,
  })
  quizGrade: number;

  @ApiProperty({
    description: 'The state of the course enrollment',
    enum: CourseEnrollmentState,
  })
  state: CourseEnrollmentState;

  @ApiProperty({
    description: 'The date and time when the enrollment ends',
    nullable: true,
  })
  endsAt: Date | null;

  @ApiProperty({
    description: 'Date when the enrollment was created',
    example: '2024-08-17T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the enrollment was last updated',
    example: '2024-08-18T14:22:33Z',
  })
  updatedAt: Date;
}
