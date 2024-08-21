import { ApiProperty } from '@nestjs/swagger';
import { Course, CourseState } from '@prisma/client';
export class CourseEntity implements Course {
  @ApiProperty({
    description: 'The unique identifier for the course',
    example: 1,
  })
  courseId: number;

  @ApiProperty({
    description: 'The title of the course',
    example: 'Introduction to NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'A brief description of the course',
    example: 'This course provides an introduction to the NestJS framework.',
  })
  description: string;

  @ApiProperty({
    description: 'Full number grades obtained in quizzes in the course',
    type: Number,
    example: 500,
    minimum: 0,
  })
  quizFullGrade: number;

  @ApiProperty({
    description: 'Grades required to pass the course',
    type: Number,
    nullable: true,
    example: 150,
    minimum: 0,
  })
  quizPassGrade: number | null;

  @ApiProperty({
    description: 'State of the course',
    enum: CourseState,
    example: CourseState.available,
    default: CourseState.created,
  })
  state: CourseState;

  @ApiProperty({
    description: 'URL where the course banner is stored',
    example: '/uploads/course/1/45/banner/234.jpg',
    nullable: true,
  })
  banner: string | null;

  @ApiProperty({
    description: 'The date and time when the course was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the course was last updated',
    example: '2023-01-02T00:00:00Z',
  })
  updatedAt: Date;
}
