import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonsContentDto {
  @ApiProperty({
    description:
      'The unique identifier of the lesson that you want to add content to',
    example: 1,
  })
  @IsInt()
  @Min(1)
  lessonId: number;

  @ApiProperty({
    description: 'The content of the lesson',
    example: 'This is the content of the lesson.',
  })
  @IsString()
  content: string;
}
