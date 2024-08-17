import { ApiProperty } from '@nestjs/swagger';
import { $Enums, LessonContent } from '@prisma/client';
export class LessonsContentEntity implements LessonContent {
  @ApiProperty({
    description: 'The unique identifier of the lesson',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The content of the lesson',
    example: 'This is the content of the lesson.',
  })
  content: string;

  @ApiProperty({
    description: 'The content type',
    examples: ['URL', 'TEXT'],
    enum: ['URL', 'TEXT'],
  })
  contentType: $Enums.ContentType;
}