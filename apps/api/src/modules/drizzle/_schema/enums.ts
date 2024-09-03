import { pgEnum } from 'drizzle-orm/pg-core';

export const CourseStateEnum = pgEnum('CourseState', [
  'created',
  'available',
  'calculated_grades',
]);

export const CourseEnrollmentStateEnum = pgEnum('CourseEnrollmentState', [
  'active',
]);

export const CourseInstructorPositionsEnum = pgEnum(
  'CourseInstructorPositions',
  ['owner', 'teacher'],
);

export const CourseInstructorStateEnum = pgEnum('CourseInstructorState', [
  'active',
]);

export const MediaTypeEnum = pgEnum('MediaType', [
  'image',
  'video',
  'audio',
  'document',
]);

export const MediaStateEnum = pgEnum('MediaState', [
  'uploading',
  'uploaded',
  'failed',
]);

export const CourseMediaTargetEnum = pgEnum('CourseMediaTarget', [
  'course_banner',
  'course_material',
  'unit_banner',
  'unit_material',
  'lesson_banner',
  'lesson_material',
]);

export const UnitStateEnum = pgEnum('UnitState', [
  'created',
  'available',
  'calculated_grades',
]);

export const LessonStateEnum = pgEnum('LessonState', [
  'created',
  'available',
  'calculated_grades',
]);

export const ContentTypeEnum = pgEnum('ContentType', ['url', 'text']);

export const QuizStateEnum = pgEnum('QuizState', [
  'created',
  'available',
  'calculated_grades',
]);

export const QuizReviewTypeEnum = pgEnum('QuizReviewType', [
  'automatic',
  'manual',
  'both',
]);

export const QuizTypeEnum = pgEnum('QuizType', [
  'randomized',
  'sequential',
  'randomized_timed',
  'sequential_timed',
]);

export const QuestionTypeEnum = pgEnum('QuestionType', [
  'multiple_choice',
  'true_false',
  'short_answer',
  'long_answer',
]);
