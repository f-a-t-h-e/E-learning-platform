import { Quiz, QuizState } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { QuizQuestionEntity } from '../../quiz-questions/entities/quiz-question.entity';
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
    description: 'URL where the lesson banner is stored',
    example:
      '/uploads/course/1/45/unit/303/lesson/202/quiz/623/banner/2354.jpg',
    nullable: true,
  })
  banner: string | null;

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

  @ApiProperty({
    description: 'State of the quiz',
    enum: QuizState,
    example: QuizState.available,
    default: QuizState.created,
  })
  state: QuizState;

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
        fullGrade: 10,
        passGrade: 5,
        options: [
          { grade: 1, optionText: 'Afghanistan', questionId: 1, id: 0 },
          { grade: 0, optionText: 'Pakistan', questionId: 1, id: 1 },
        ],
      },
    ],
    required: false,
  })
  @Type(() => QuizQuestionEntity)
  Questions?: QuizQuestionEntity[];
}
