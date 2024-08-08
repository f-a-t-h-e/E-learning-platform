import { ApiProperty } from '@nestjs/swagger';
import { Course as PCourse } from '@prisma/client';
export class Course implements PCourse {
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
