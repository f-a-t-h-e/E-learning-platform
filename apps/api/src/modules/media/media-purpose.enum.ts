import { $Enums } from '@prisma/client';

export const MediaPurposeEnum: MediaPurposeEnum = {
  ...$Enums.QuizMediaPurpose,
  ...$Enums.UnitMediaPurpose,
  ...$Enums.CourseMediaPurpose,
  ...$Enums.LessonMediaPurpose,
  ...$Enums.UserProfileMediaPurpose,
  ...$Enums.QuizSubmissionMediaPurpose,
};

export type MediaPurposeEnum = typeof $Enums.QuizMediaPurpose &
  typeof $Enums.UnitMediaPurpose &
  typeof $Enums.CourseMediaPurpose &
  typeof $Enums.LessonMediaPurpose &
  typeof $Enums.UserProfileMediaPurpose &
  typeof $Enums.QuizSubmissionMediaPurpose;

export const MediaPurposeTargetEnum = {
  quiz_banner: {
    table: ['quizMedia', 'QuizMedia'],
    targetId: 'quizId',
    pk: 'quizMediaId',
  },
  quiz_material: {
    table: ['quizMedia', 'QuizMedia'],
    targetId: 'quizId',
    pk: 'quizMediaId',
  },
  unit_banner: {
    table: ['unitMedia', 'UnitMedia'],
    targetId: 'unitId',
    pk: 'unitMediaId',
  },
  unit_material: {
    table: ['unitMedia', 'UnitMedia'],
    targetId: 'unitId',
    pk: 'unitMediaId',
  },
  course_banner: {
    table: ['courseMedia', 'CourseMedia'],
    targetId: 'courseId',
    pk: 'courseMediaId',
  },
  course_material: {
    table: ['courseMedia', 'CourseMedia'],
    targetId: 'courseId',
    pk: 'courseMediaId',
  },
  lesson_banner: {
    table: ['lessonMedia', 'LessonMedia'],
    targetId: 'lessonId',
    pk: 'lessonMediaId',
  },
  lesson_material: {
    table: ['lessonMedia', 'LessonMedia'],
    targetId: 'lessonId',
    pk: 'lessonMediaId',
  },
  profile_banner: {
    table: ['userProfileMedia', 'UserProfileMedia'],
    targetId: 'userProfileId',
    pk: 'userProfileMediaId',
  },
  profile_photo: {
    table: ['userProfileMedia', 'UserProfileMedia'],
    targetId: 'userProfileId',
    pk: 'userProfileMediaId',
  },
  full_quiz_answers: {
    table: ['quizSubmissionMedia', 'QuizSubmissionMedia'],
    targetId: 'quizSubmissionId',
    pk: 'quizSubmissionMediaId',
  },
  single_question_answer: {
    table: ['quizSubmissionMedia', 'QuizSubmissionMedia'],
    targetId: 'quizSubmissionId',
    pk: 'quizSubmissionMediaId',
  },
  part_of_the_quiz_answers: {
    table: ['quizSubmissionMedia', 'QuizSubmissionMedia'],
    targetId: 'quizSubmissionId',
    pk: 'quizSubmissionMediaId',
  },
} as const;
