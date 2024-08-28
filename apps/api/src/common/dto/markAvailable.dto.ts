import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class MarkAvailableDto {
  @ApiProperty({
    description: 'Indicates if all states should be considered',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allStates?: boolean;

  @ApiProperty({
    description:
      'Indicates if all content under this entity should be edited automatically',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  auto?: boolean;
}
