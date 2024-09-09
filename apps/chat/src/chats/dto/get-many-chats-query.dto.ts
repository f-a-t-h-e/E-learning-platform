import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { TPagination } from 'common/types/pagination.type';

export class GetManyChatsQueryDto
  implements Partial<TPagination<'chat', Date>>
{
  @ApiProperty({
    description: `The last chat \`lastUpdate\` that you have`,
    example: new Date().toISOString(),
    required: false,
    type: 'date',
  })
  @Transform(({ value }) => {
    return new Date(value);
  })
  @IsDate()
  @IsOptional()
  chatCursor?: Date;

  @ApiProperty({
    description: `- The number of chats you show in each page.
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
        `"chatPageSize" should be an integer or empty`,
      );
    }
    if (value < -4 || value > 4) {
      return value;
    }
    throw new BadRequestException(`"chatPageSize" can't be less than |5|.`);
  })
  @IsInt()
  @IsOptional()
  chatPageSize?: number | undefined;

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
  chatSkip?: number | undefined;
}
