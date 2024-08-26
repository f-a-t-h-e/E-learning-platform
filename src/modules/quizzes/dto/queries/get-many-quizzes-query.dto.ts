import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { TPagination } from 'src/common/types/pagination.type';

export class GetManyQuizzesQueryDto
  implements Partial<TPagination<'quiz', number>>
{
  @ApiProperty({
    description: `The last quiz order that you have`,
    minimum: 1,
    example: 1,
    required: false,
    type: 'integer',
  })
  @Transform((v) => parseInt(v.value))
  @IsInt()
  @Min(1)
  @IsOptional()
  quizCursor?: number | undefined;

  @ApiProperty({
    description: `- The number of quizzes you show in each page.
- Should be less than \`-4\` or greater than \`4\`.
- Use \`negative\` value for the opposite direction.`,
    example: 10,
    required: false,
    type: 'integer',
  })
  @Transform((v) => {
    const value = parseInt(v.value);
    if (isNaN(value)) {
      throw new BadRequestException(
        `"quizPageSize" should be an integer or empty`,
      );
    }
    if (value < -4 || value > 4) {
      return value;
    }
    throw new BadRequestException(`"quizPageSize" can't be less than |5|.`);
  })
  @IsInt()
  @IsOptional()
  quizPageSize?: number | undefined;

  @ApiProperty({
    description: `The number of pages to skip after this cursor.`,
    example: 0,
    minimum: 0,
    required: false,
    type: 'integer',
  })
  @Transform((v) => parseInt(v.value))
  @IsInt()
  @Min(0)
  @IsOptional()
  quizSkip?: number | undefined;

  @ApiProperty({
    description: `The course that you want to see its quizzes`,
    minimum: 1,
    example: 1,
    required: true,
    type: 'integer',
  })
  @Transform((v) => parseInt(v.value))
  @IsInt()
  @Min(1)
  courseId: number;

  @ApiProperty({
    description: `The unit that you want to see its quizzes`,
    minimum: 1,
    example: 1,
    required: false,
    type: 'null_or_integer',
    pattern: `^(null|\\d+)$`,
  })
  @Transform((v) =>
    v.value == 'null' || v.value == null ? null : parseInt(v.value),
  )
  @IsInt()
  @Min(1)
  @IsOptional()
  unitId: number;

  @ApiProperty({
    description: `The lesson that you want to see its quizzes`,
    minimum: 1,
    example: 1,
    required: false,
    type: 'null_or_integer',
    pattern: `^(null|\\d+)$`,
  })
  @Transform((v) =>
    v.value == 'null' || v.value == null ? null : parseInt(v.value),
  )
  @IsInt()
  @Min(1)
  @IsOptional()
  lessonId: number;

  //   @ApiProperty({

  //   })
  //   orderBy:
}
