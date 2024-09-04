import { MediaState, MediaType, QuizState } from '@prisma/client';
import { MediaPurposeEnum } from '../../modules/media/media-purpose.enum';

// SELECTS FOR EVERYONE (public to anyone visits the platform)
// Unit
export const SELECT_UNIT_PUBLIC = {
  unitId: true,
  order: true,
  title: true,
  description: true,
  banner: true,
} as const;
export type TSelectUnitPublic = {
  unitId: number;
  order: number;
  title: string;
  description: string | null;
  banner: string | null;
  Lessons?: TSelectLessonPublic[];
  Quizzes?: TSelectQuizPublic[];
};

// Lesson
export const SELECT_LESSON_PUBLIC = {
  lessonId: true,
  unitId: true,
  order: true,
  title: true,
  description: true,
  banner: true,
} as const;
export type TSelectLessonPublic = {
  lessonId: number;
  unitId: number;
  order: number;
  title: string;
  description: string | null;
  banner: string | null;
  Quizzes?: TSelectQuizPublic[];
};

// Quiz
export const SELECT_QUIZ_PUBLIC = {
  quizId: true,
  order: true,
  state: true,
  title: true,
  unitId: true,
  lessonId: true,
} as const;
export type TSelectQuizPublic = {
  quizId: number;
  order: number;
  state: QuizState;
  title: string;
  unitId: number;
  lessonId: number;
};

// Media
export const SELECT_MEDIA_PUBLIC = {
  purpose: true,
  type: true,
  extension: true,
  url: true,
  updatedAt: true,
  state: true,
} as const;
export type TSelectMediaPublic = {
  purpose: keyof MediaPurposeEnum;
  type: MediaType;
  extension: string;
  url: string;
  updatedAt: Date;
  state: MediaState;
};
