import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({
    description: 'The title of the lesson',
    example: 'Introduction to TypeScript Functions',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description:
      'The unique identifier of the course to which this lesson belongs',
    example: 101,
  })
  @IsNumber()
  courseId: number;

  @ApiProperty({
    description:
      'The unique identifier of the unit to which this lesson belongs',
    example: 201,
  })
  @IsNumber()
  unitId: number;

  @ApiProperty({
    description: 'A brief description of the lesson',
    example: 'This lesson covers the basics of TypeScript functions.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
