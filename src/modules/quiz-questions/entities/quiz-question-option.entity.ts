import { QuizQuestionOption } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QuizQuestionOptionEntity implements QuizQuestionOption {
  @ApiProperty({
    description: 'Unique identifier (for each question) for the option',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Mark awarded for selecting this option',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  mark: number;

  @ApiProperty({
    description: 'Text of the option',
    example: 'Paris',
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
