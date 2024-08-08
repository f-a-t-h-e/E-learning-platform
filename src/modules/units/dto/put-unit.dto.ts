import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PutUnitDto {
  @ApiProperty({
    description: 'The title of the unit',
    example: 'Introduction to TypeScript',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'A brief description of the unit',
    example: 'This unit covers the basics of TypeScript.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
