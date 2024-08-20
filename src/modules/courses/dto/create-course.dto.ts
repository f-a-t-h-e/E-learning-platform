import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The title of the course',
    example: 'Introduction to NestJS',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'A brief description of the course',
    example: 'This course provides an introduction to the NestJS framework.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Attendance mark for the course, can be null',
    type: Number,
    nullable: true,
    example: null,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  attendanceMark?: number | null;
}
