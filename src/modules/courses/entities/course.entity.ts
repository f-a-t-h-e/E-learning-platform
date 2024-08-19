import { ApiProperty } from '@nestjs/swagger';
import { Course } from '@prisma/client';
export class CourseEntity implements Course {
  @ApiProperty({
    description: 'The unique identifier for the course',
    example: 1,
  })
  id: number;

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
