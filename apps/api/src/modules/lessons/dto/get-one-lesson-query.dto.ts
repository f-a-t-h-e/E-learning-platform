import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanString, IsOptional } from 'class-validator';

export class GetOneLessonQueryDto {
  @ApiProperty({
    description: `Use it to get the content of the lessons as well`,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value == 'true')
  getContent?: boolean;

  @ApiProperty({
    description: 'Include media within lessons in the response.',
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value == 'true')
  getLessonsMedia?: boolean;

  @ApiProperty({
    description: 'Include quizzes within lessons in the response.',
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value == 'true')
  getLessonsQuizzes?: boolean;
}
