import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';

enum States_Enum {
  'available' = 'available',
  'calculated_grades' = 'calculated_grades',
}

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

  @ApiProperty({
    description: `The state that the entity should be.`,
    enum: States_Enum,
    example: States_Enum.available,
  })
  @IsEnum(States_Enum)
  state: States_Enum;

  @ApiProperty({
    description: `The pass grade of the entity.`,
    type: 'integer',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsInt()
  passGrade?: number;
}
