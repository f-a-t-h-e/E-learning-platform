import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonsContentDto {
  @ApiProperty({
    description: 'The unique identifier of the lesson',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'The content of the lesson',
    example: 'This is the content of the lesson.',
  })
  @IsString()
  content: string;
}
