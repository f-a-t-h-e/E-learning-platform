import { $Enums } from '@prisma/client';

export type TGetCreateAuthDetailsReturn = {
  courseId: number;
  state: $Enums.CourseState;
  Instructors: {
    position: $Enums.CourseInstructorPositions;
    state: $Enums.CourseInstructorState;
    endsAt: Date | null;
  }[];
  Units?: {
    state: $Enums.UnitState;
  }[];
  Lessons?: {
    state: $Enums.LessonState;
    unitId: number;
  }[];
};

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
