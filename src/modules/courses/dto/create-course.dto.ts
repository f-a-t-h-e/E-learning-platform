import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
}
