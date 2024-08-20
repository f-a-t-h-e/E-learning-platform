import { ApiProperty } from '@nestjs/swagger';
import { Unit } from '@prisma/client';
export class UnitEntity implements Unit {
  @ApiProperty({
    description: 'The unique identifier for the unit',
    example: 1,
  })
  unitId: number;

  @ApiProperty({
    description: 'The order of the unit in the sequence',
    type: Number,
    example: 1,
    minimum: 1,
  })
  order: number;

  @ApiProperty({
    description: 'The title of the unit',
    example: 'Introduction to TypeScript',
  })
  title: string;

  @ApiProperty({
    description: 'A brief description of the unit',
    example: 'This unit covers the basics of TypeScript.',
  })
  description: string;

  @ApiProperty({
    description: 'Marks awarded for attendance in the unit',
    type: Number,
    example: 75,
    minimum: 0,
    nullable: true,
  })
  attendanceMark: number | null;

  @ApiProperty({
    description: 'Marks obtained in quizzes for the unit',
    type: Number,
    example: 85,
    minimum: 0,
  })
  quizzesMark: number;

  @ApiProperty({
    description:
      'The unique identifier of the course to which this unit belongs',
    example: 101,
  })
  courseId: number;

  @ApiProperty({
    description: 'The unique identifier of the teacher who added this unit',
    example: 501,
  })
  userId: number;

  @ApiProperty({
    description: 'The date and time when the unit was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the unit was last updated',
    example: '2023-01-02T00:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'URL where the unit banner is stored',
    example: '/uploads/course/1/45/unit/0/303/banner/1034.jpg',
    nullable: true,
  })
  banner: string | null;
}
