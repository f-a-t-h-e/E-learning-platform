import { pgEnum } from "drizzle-orm/pg-core"

export const contentType = pgEnum("ContentType", ['url', 'text'])
export const courseEnrollmentState = pgEnum("CourseEnrollmentState", ['active'])
export const courseInstructorPositions = pgEnum("CourseInstructorPositions", ['owner', 'teacher'])
export const courseInstructorState = pgEnum("CourseInstructorState", ['active'])
export const courseMediaTarget = pgEnum("CourseMediaTarget", ['course_banner', 'course_material', 'unit_banner', 'unit_material', 'lesson_banner', 'lesson_material'])
export const courseState = pgEnum("CourseState", ['created', 'available', 'calculated_grades'])
export const lessonState = pgEnum("LessonState", ['created', 'available', 'calculated_grades'])
export const mediaState = pgEnum("MediaState", ['uploading', 'uploaded', 'failed'])
export const mediaType = pgEnum("MediaType", ['image', 'video', 'audio', 'document'])
export const questionType = pgEnum("QuestionType", ['multiple_choice', 'true_false', 'short_answer', 'long_answer'])
export const quizReviewType = pgEnum("QuizReviewType", ['automatic', 'manual', 'both'])
export const quizState = pgEnum("QuizState", ['created', 'available', 'calculated_grades'])
export const quizType = pgEnum("QuizType", ['randomized', 'sequential', 'randomized_timed', 'sequential_timed'])
export const unitState = pgEnum("UnitState", ['created', 'available', 'calculated_grades'])

