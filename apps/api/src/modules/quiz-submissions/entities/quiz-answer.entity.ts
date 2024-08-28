import { ApiProperty } from '@nestjs/swagger';
import { QuizAnswer } from '@prisma/client';

export class QuizAnswerEntity implements QuizAnswer {
  @ApiProperty({
    description: 'Unique identifier for the quiz answer',
    example: 1,
  })
  quizAnswerId: number;

  @ApiProperty({
    description: 'The text of the answer provided by the student',
    example: 'Paris',
    nullable: true,
  })
  answer: string | null;

  @ApiProperty({
    description: 'Grades awarded for the answer',
    example: 5,
    nullable: true,
  })
  grade: number | null;

  @ApiProperty({
    description: 'Unique identifier for the associated quiz question',
    example: 1,
  })
  questionId: number;

  @ApiProperty({
    description:
      'Unique identifier for the quiz submission to which this answer belongs',
    example: 1,
  })
  submissionId: number;

  @ApiProperty({
    description: 'Unique identifier for the option chosen',
    example: 1,
    nullable: true,
  })
  chosenOptionId: number | null;
}
