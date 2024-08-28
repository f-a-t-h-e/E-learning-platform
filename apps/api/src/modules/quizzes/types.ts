import { $Enums, Quiz, QuizMetaData } from '@prisma/client';
import { FieldsOrNullFields } from '../../common/types/fieldsOrNullFields.type';

export type TGetManyQuizzesForStudent = {
  quizId: number;
  courseId: number;
  unitId: number;
  lessonId: number;
  order: number;
  state: $Enums.QuizState;
  title: string;
  startsAt: Date;
  endsAt: Date | null;
  lateSubmissionDate: Date | null;
  attemptsAllowed: number | null;
  fullGrade: number;
  type: $Enums.QuizType;
};
export type TGetManyQuizzesForInstructor = QuizMetaData & Quiz;

export type TGetInstructorAuthPerQuiz = {
  quizId: number;
  courseId: number;
} & FieldsOrNullFields<{
  enrollmentState: $Enums.CourseInstructorState;
  position: $Enums.CourseInstructorPositions;
  courseInstructorId: number;
  endsAt: Date | null;
}>;

export type TGetInstructorAuthForCourse = {
  courseState: $Enums.CourseState;
} & FieldsOrNullFields<{
  enrollmentState: $Enums.CourseInstructorState;
  position: $Enums.CourseInstructorPositions;
  courseInstructorId: number;
  endsAt: Date | null;
}>;

export type TGetStudentAuth = {
  courseState: $Enums.CourseState;
} & FieldsOrNullFields<{
  enrollmentState: $Enums.CourseEnrollmentState;
  courseEnrollmentId: number;
  endsAt: Date | null;
}>;

export type TGetStudentAuthPerQuiz = {
  quizState: $Enums.QuizState;
  courseState: $Enums.CourseState;
} & FieldsOrNullFields<{
  enrollmentState: $Enums.CourseEnrollmentState;
  courseEnrollmentId: number;
  endsAt: Date | null;
}>;

export type TGetCreateAuthDetailsReturn = {
  courseId: number;
  courseState: $Enums.CourseState;
  position: $Enums.CourseInstructorPositions;
  instructorState: $Enums.CourseInstructorState;
  instructorEndsAt: Date | null;
} & FieldsOrNullFields<{
  unitState: $Enums.UnitState;
}> &
  FieldsOrNullFields<{
    lessonState: $Enums.LessonState;
    unitId: number;
  }>;

export type TGetUpdateAuthDetailsReturn = {
  courseId: number;
  unitId: number;
  lessonId: number;
  Questions: {
    Options: {
      quizeQuestionOptionId: number;
    }[];
    quizQuestionId: number;
  }[];
  state: $Enums.QuizState;
  Course: {
    state: $Enums.CourseState;
    Instructors: {
      endsAt: Date;
      state: $Enums.CourseInstructorState;
      courseInstructorId: number;
      position: $Enums.CourseInstructorPositions;
    }[];
    Units?: {
      state: $Enums.UnitState;
    }[];
    Lessons?: {
      state: $Enums.LessonState;
      unitId: number;
    }[];
  };
  QuizMetaData: {
    quizId: number;
    fullGrade: number;
    passGrade: number | null;
    attemptsAllowed: number | null;
    reviewType: $Enums.QuizReviewType;
    type: $Enums.QuizType;
    startsAt: Date;
    endsAt: Date | null;
    lateSubmissionDate: Date | null;
  };
};
