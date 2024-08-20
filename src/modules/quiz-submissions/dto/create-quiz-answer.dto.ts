import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateQuizAnswerDto {
  @ApiProperty({
    description: 'The text of the answer provided by the student',
    example: 'Paris',
  })
  @IsString()
  answer: string;

  @ApiProperty({
    description: 'Unique identifier for the associated quiz question',
    example: 301,
  })
  @IsInt()
  questionId: number;

  // @ApiProperty({
  //   description:
  //     'Unique identifier for the quiz submission to which this answer belongs',
  //   example: 401,
  // })
  // @IsInt()
  // submissionId: number;
}
