import { Quiz } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { QuizQuestionEntity } from 'src/modules/quiz-questions/entities/quiz-question.entity';
import { Type } from 'class-transformer';

export class QuizEntity implements Quiz {
  @ApiProperty({ description: 'ID of the quiz', example: 1 })
  quizId: number;

    
  @ApiProperty({
    description: 'The order of the quiz in the sequence',
    type: Number,
    example: 1,
    minimum: 1,
  })
  order: number;


  @ApiProperty({ description: 'Title of the quiz', example: 'Final Exam' })
  title: string;

  @ApiProperty({
    description: 'ID of the associated course',
    example: 101,
    nullable: true,
  })
  courseId: number | null;

  @ApiProperty({
    description: 'ID of the associated unit',
    example: 202,
    nullable: true,
  })
  unitId: number | null;

  @ApiProperty({
    description: 'ID of the associated lesson',
    example: 303,
    nullable: true,
  })
  lessonId: number | null;

  @ApiProperty({ description: 'Full mark of the quiz', example: 100 })
  fullMark: number;

  @ApiProperty({ description: 'Pass mark of the quiz', example: 60 })
  passMark: number;

  @ApiProperty({
    description: 'Date when the quiz starts',
    example: '2024-09-01T00:00:00Z',
  })
  startsAt: Date;

  @ApiProperty({
    description: 'Date when the quiz ends',
    example: '2024-09-10T23:59:59Z',
    nullable: true,
  })
  endsAt: Date | null;

  @ApiProperty({
    description: 'Date for late submission',
    example: '2024-09-12T23:59:59Z',
    nullable: true,
  })
  lateSubmissionDate: Date | null;

  @ApiProperty({
    description: 'Creation date of the quiz',
    example: '2024-08-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the quiz',
    example: '2024-08-10T15:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    type: [QuizQuestionEntity],
    description: 'Array of questions for the quiz',
    example: [
      {
        questionText: 'Which country has less population?',
        questionType: 'MULTIPLE_CHOICE',
        fullMark: 10,
        passMark: 5,
        options: [
          { mark: 1, optionText: 'Afghanistan', questionId: 1, id: 0 },
          { mark: 0, optionText: 'Pakistan', questionId: 1, id: 1 },
        ],
      },
    ],
    required: false,
  })
  @Type(() => QuizQuestionEntity)
  Questions?: QuizQuestionEntity[];
}
