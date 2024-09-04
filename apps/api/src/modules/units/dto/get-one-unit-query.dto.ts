import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { GetOneLessonQueryDto } from '../../lessons/dto/get-one-lesson-query.dto';
import { Transform } from 'class-transformer';

export class GetOneUnitQueryDto extends OmitType(GetOneLessonQueryDto, [
  'getContent',
]) {
  @ApiProperty({
    description: 'Include lessons within units in the response.',
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value == 'true')
  getLessons?: boolean;

  @ApiProperty({
    description: 'Include media within units in the response.',
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value == 'true')
  getUnitsMedia?: boolean;

  @ApiProperty({
    description: 'Include quizzes within units in the response.',
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => value == 'true')
  getUnitsQuizzes?: boolean;
}
