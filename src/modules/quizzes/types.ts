import { $Enums } from '@prisma/client';

export type TGetCreateAuthDetailsReturn = {
  courseId: number;
  courseState: $Enums.CourseState;

  position: $Enums.CourseInstructorPositions;
  instructorState: $Enums.CourseInstructorState;
  instructorEndsAt: Date | null;
} & (
  | {
      unitState: null;
    }
  | {
      unitState: $Enums.UnitState;
    }
) &
  (
    | {
        lessonState: null;
        unitId: null;
      }
    | {
        lessonState: $Enums.LessonState;
        unitId: number;
      }
  );

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
