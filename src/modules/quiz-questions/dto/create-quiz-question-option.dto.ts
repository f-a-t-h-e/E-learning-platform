import { IsNotEmpty, IsString, Min, Max, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizQuestionOptionDto {
  @ApiProperty({
    description:
      'Unique identifier (for each question) for the option. \nYou can add up to 10 options.',
    example: 1,
    minimum: 1,
    maximum: 11,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(11)
  quizeQuestionOptionId: number;

  @ApiProperty({
    description: 'Grade awarded for selecting this option',
    example: 1,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  grade: number;

  @ApiProperty({
    description: 'Text of the option',
    example: 'Afghanistan',
  })
  @IsNotEmpty()
  @IsString()
  optionText: string;

  @ApiProperty({
    description: 'ID of the question to which this option belongs',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  questionId: number;
}
