import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty({
    description: 'The order of the unit in the sequence',
    type: Number,
    example: 1,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(1, { message: 'Order must be at least 1' })
  order: number;

  @ApiProperty({
    description: 'The title of the unit',
    example: 'Introduction to TypeScript',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description:
      'The unique identifier of the course to which this unit belongs',
    example: 101,
  })
  @IsNumber()
  courseId: number;

  @ApiProperty({
    description: 'A brief description of the unit',
    example: 'This unit covers the basics of TypeScript.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
