import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizQuestionOptionDto {
  @ApiProperty({
    description:
      'Unique identifier (for each question) for the option. \nYou can add up to 10 options.',
    example: 1,
    minimum: 0,
    maximum: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  quizeQuestionOptionId: number;

  @ApiProperty({
    description: 'Mark awarded for selecting this option',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  mark: number;

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
  })
  @IsNotEmpty()
  @IsNumber()
  questionId: number;
}
