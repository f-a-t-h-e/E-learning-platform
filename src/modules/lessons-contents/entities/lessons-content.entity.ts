import { ApiProperty } from '@nestjs/swagger';
import { $Enums, LessonContent } from '@prisma/client';
export class LessonsContentEntity implements LessonContent {
  @ApiProperty({
    description: 'The unique identifier of the lesson',
    example: 1,
  })
  lessonId: number;

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

  @ApiProperty({
    description: 'The date and time when the lesson was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the lesson was last updated',
    example: '2023-01-02T00:00:00Z',
  })
  updatedAt: Date;
}
