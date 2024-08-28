import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateLessonsContentDto {
  @ApiProperty({
    description: 'The content of the lesson',
    example: 'This is the content of the lesson.',
  })
  @IsString()
  content: string;
}
