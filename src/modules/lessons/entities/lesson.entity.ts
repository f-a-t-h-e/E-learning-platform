import { ApiProperty } from '@nestjs/swagger';
import { Lesson as PLesson } from '@prisma/client';
export class Lesson implements PLesson {
  @ApiProperty({
    description: 'The unique identifier for the lesson',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the lesson',
    example: 'Introduction to TypeScript',
  })
  title: string;

  @ApiProperty({
    description: 'A brief description of the lesson',
    example: 'This lesson covers the basics of TypeScript.',
  })
  description: string;

  @ApiProperty({
    description:
      'The unique identifier of the course to which this lesson belongs',
    example: 101,
  })
  courseId: number;
  @ApiProperty({
    description:
      'The unique identifier of the unit to which this lesson belongs',
    example: 973,
  })
  unitId: number;

  @ApiProperty({
    description: 'The unique identifier of the teacher who added this lesson',
    example: 501,
  })
  addedBy: number;

  @ApiProperty({
    description: 'The date and time when the lesson was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the lesson was last updated',
    example: '2023-01-02T00:00:00Z',
  })
  updatedAt: Date;
}
