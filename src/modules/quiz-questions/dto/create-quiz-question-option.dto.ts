import { IsString, Min, Max, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizQuestionOptionDto {
  @ApiProperty({
    description: 'The order of the option. \nYou can add up to 10 options.',
    example: 1,
    minimum: 1,
    maximum: 11,
  })
  @IsInt()
  @Min(1)
  @Max(11)
  order: number;

  @ApiProperty({
    description: 'Grade awarded for selecting this option',
    example: 1,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  grade: number;

  @ApiProperty({
    description: 'Text of the option',
    example: 'Afghanistan',
  })
  @IsString()
  optionText: string;

  @ApiProperty({
    description: 'ID of the question to which this option belongs',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  questionId: number;
}
