import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PutLessonDto {
  @ApiProperty({
    description: 'The order of the lesson in the sequence',
    type: Number,
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({
    description: 'The title of the lesson',
    example: 'Introduction to TypeScript Functions',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description:
      'The unique identifier of the unit to which this lesson belongs',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  unitId: number;

  @ApiProperty({
    description: 'A brief description of the lesson',
    example: 'This lesson covers the basics of TypeScript functions.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
