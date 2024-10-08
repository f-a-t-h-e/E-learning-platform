import { ApiProperty } from '@nestjs/swagger';
import { Lesson, LessonState } from '@prisma/client';
export class LessonEntity implements Lesson {
  @ApiProperty({
    description: 'The unique identifier for the lesson',
    example: 1,
  })
  lessonId: number;

  @ApiProperty({
    description: 'The order of the lesson in the sequence',
    type: Number,
    example: 1,
    minimum: 1,
  })
  order: number;

  @ApiProperty({
    description: 'The full grade achievable for the whole lesson',
  })
  quizFullGrade: number;

  @ApiProperty({
    description: 'The passing grade for the whole lesson',
    nullable: true,
  })
  quizPassGrade: number | null;

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
    description: 'URL where the lesson banner is stored',
    example: '/uploads/course/1/45/unit/0/303/lesson/0/202/banner/2354.jpg',
    nullable: true,
  })
  banner: string | null;

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
  userId: number;

  @ApiProperty({
    description: 'State of the lesson',
    enum: LessonState,
    example: LessonState.available,
    default: LessonState.created,
  })
  state: LessonState;

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
