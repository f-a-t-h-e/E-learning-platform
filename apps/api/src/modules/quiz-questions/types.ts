import { $Enums } from '@prisma/client';
import { FieldsOrNullFields } from '../../common/types';

export type TGetQuestionsDetailsForStudentWithAuth = {
  quizId: number;
  correctAnswer?: string | null;
  order: number;
  fullGrade: number;
  passGrade: number | null;
  questionType: string;
  questionText: string;
  courseId: number;
  courseState?: $Enums.CourseState;
  quizType: $Enums.QuizType;
  quizStartsAt: Date;
  quizEndsAt: Date | null;
} & FieldsOrNullFields<{
  enrollmentState: $Enums.CourseEnrollmentState;
  enrollmentEndsAt: Date | null;
}> &
  FieldsOrNullFields<{
    quizAnswerId: number;
    studentAnswer: string | null;
    chosenOptionId: number | null;
    answerGrade: number | null;
  }>;
