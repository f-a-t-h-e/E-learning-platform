import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { GetOneUnitQueryDto } from '../../units/dto/get-one-unit-query.dto';
import { Transform } from 'class-transformer';

export class GetOneCourseQueryDto extends GetOneUnitQueryDto {
  @ApiProperty({
    description: 'Include units in the response.',
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value == 'true')
  getUnits?: boolean;

  @ApiProperty({
    description: 'Include course media in the response.',
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value == 'true')
  getCourseMedia?: boolean;

  @ApiProperty({
    description: 'Include quizzes associated with the course in the response.',
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value == 'true')
  getCourseQuizzes?: boolean;
}
