import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateQuizAnswerDto {
  @ApiProperty({
    description: 'The text of the answer provided by the student',
    example: 'Afghanistan',
  })
  @IsString()
  answer: string;

  @ApiProperty({
    description: 'Unique identifier for the associated quiz question',
    example: 1,
  })
  @IsInt()
  @Min(1)
  questionId: number;


  @ApiProperty({
    description: `The id of the chosen option`,
    example: 1
  })
  @IsInt()
  @Min(1)
  chosenOptionId?: number
  // @ApiProperty({
  //   description:
  //     'Unique identifier for the quiz submission to which this answer belongs',
  //   example: 401,
  // })
  // @IsInt()
  // submissionId: number;
}
