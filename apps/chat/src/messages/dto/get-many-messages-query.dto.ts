import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class GetManyMessagesQueryDto {
  @ApiProperty({
    description: `The last message \`createdAt\` that you have`,
    example: new Date().toISOString(),
    required: false,
    type: 'date',
  })
  @Transform(({ value }) => {
    return new Date(value);
  })
  @IsDate()
  @IsOptional()
  messageCursor?: Date;

  @ApiProperty({
    description: `- The number of messages you show in each page.
    - Should be less than \`-4\` or greater than \`4\`.
    - Use \`negative\` value for the opposite direction.`,
    example: 10,
    required: false,
    type: 'integer',
  })
  @Transform((v) => parseInt(v.value))
  @IsInt()
  @IsOptional()
  messagePageSize?: number;

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
  messageSkip?: number;
}
