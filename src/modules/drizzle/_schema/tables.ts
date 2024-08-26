import {
  bigint,
  integer,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import {
  ContentTypeEnum,
  CourseEnrollmentStateEnum,
  CourseInstructorPositionsEnum,
  CourseInstructorStateEnum,
  CourseMediaTargetEnum,
  CourseStateEnum,
  LessonStateEnum,
  MediaStateEnum,
  MediaTypeEnum,
  QuestionTypeEnum,
  QuizReviewTypeEnum,
  QuizStateEnum,
  QuizTypeEnum,
  UnitStateEnum,
} from './enums';

export const User = pgTable('User', {
  userId: serial('userId').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  roleName: varchar('roleName', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const Session = pgTable('Session', {
  sessionId: serial('sessionId').primaryKey(),
  refreshToken: varchar('refreshToken', { length: 255 }).notNull(),
  userId: integer('userId')
    .references(() => User.userId)
    .notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
});

export const UserProfile = pgTable('UserProfile', {
  userId: integer('userId')
    .references(() => User.userId)
    .unique()
    .notNull(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  secondName: varchar('secondName'),
  thirdName: varchar('thirdName'),
  lastName: varchar('lastName', { length: 255 }).notNull(),
  bio: varchar('bio'),
  avatar: varchar('avatar'),
  banner: varchar('banner'),
  phone: varchar('phone'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const Role = pgTable('Role', {
  name: varchar('name', { length: 255 }).unique().notNull(),
});

export const Course = pgTable('Course', {
  courseId: serial('courseId').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description'),
  banner: varchar('banner', { length: 255 }),
  quizFullGrade: integer('quizFullGrade').notNull(),
  quizPassGrade: integer('quizPassGrade'),
  state: CourseStateEnum('state').default('created').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const CourseEnrollment = pgTable('CourseEnrollment', {
  courseEnrollmentId: serial('courseEnrollmentId').primaryKey(),
  courseId: integer('courseId').notNull(),
  studentId: integer('studentId').notNull(),
  state: CourseEnrollmentStateEnum('state').notNull(),
  quizGrade: integer('quizGrade').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  endsAt: timestamp('endsAt', { withTimezone: true }),
});

export const CourseInstructor = pgTable('CourseInstructor', {
  courseInstructorId: serial('courseInstructorId').primaryKey(),
  courseId: integer('courseId').notNull(),
  instructorId: integer('instructorId').notNull(),
  position: CourseInstructorPositionsEnum('position').notNull(),
  state: CourseInstructorStateEnum('state').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  endsAt: timestamp('endsAt', { withTimezone: true }),
});

export const CourseMedia = pgTable('CourseMedia', {
  courseMediaId: serial('courseMediaId').primaryKey(),
  url: varchar('url', { length: 255 }).notNull(),
  type: MediaTypeEnum('type').notNull(),
  extension: varchar('extension', { length: 255 }).notNull(),
  state: MediaStateEnum('state').notNull(),
  bytes: bigint('bytes', { mode: 'bigint' }).notNull(),
  userId: integer('userId')
    .references(() => UserProfile.userId)
    .notNull(),
  targetId: integer('targetId'),
  target: CourseMediaTargetEnum('target').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const Unit = pgTable('Unit', {
  unitId: serial('unitId').primaryKey(),
  order: integer('order').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description'),
  banner: varchar('banner'),
  quizFullGrade: integer('quizFullGrade').notNull(),
  quizPassGrade: integer('quizPassGrade'),
  courseId: integer('courseId').notNull(),
  userId: integer('userId')
    .references(() => UserProfile.userId)
    .notNull(),
  state: UnitStateEnum('state').default('created').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const Lesson = pgTable('Lesson', {
  lessonId: serial('lessonId').primaryKey(),
  order: integer('order').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  banner: varchar('banner'),
  description: varchar('description'),
  quizFullGrade: integer('quizFullGrade').notNull(),
  quizPassGrade: smallint('quizPassGrade'),
  unitId: integer('unitId').notNull(),
  userId: integer('userId')
    .references(() => UserProfile.userId)
    .notNull(),
  courseId: integer('courseId').notNull(),
  state: LessonStateEnum('state').default('created').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const LessonContent = pgTable('LessonContent', {
  lessonId: integer('lessonId')
    .unique()
    .references(() => Lesson.lessonId)
    .notNull(),
  contentType: ContentTypeEnum('contentType').notNull(),
  content: varchar('content', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const Quiz = pgTable('Quiz', {
  quizId: serial('quizId').primaryKey(),
  order: integer('order').notNull(),
  courseId: integer('courseId').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  unitId: integer('unitId'),
  lessonId: integer('lessonId'),
  state: QuizStateEnum('state').default('created').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const QuizMetaData = pgTable('QuizMetaData', {
  quizId: integer('quizId')
    .references(() => Quiz.quizId)
    .unique()
    .notNull(),
  fullGrade: integer('fullGrade').notNull(),
  passGrade: smallint('passGrade').default(0),
  attemptsAllowed: smallint('attemptsAllowed'),
  reviewType: QuizReviewTypeEnum('reviewType').notNull(),
  type: QuizTypeEnum('type').notNull(),
  startsAt: timestamp('startsAt', { withTimezone: true }).notNull(),
  endsAt: timestamp('endsAt', { withTimezone: true }),

  lateSubmissionDate: timestamp('lateSubmissionDate', { withTimezone: true }),
});

export const QuizQuestion = pgTable('QuizQuestion', {
  quizQuestionId: serial('quizQuestionId').primaryKey(),
  order: integer('order').notNull(),
  quizId: integer('quizId').notNull(),
  questionText: varchar('questionText', { length: 255 }).notNull(),
  fullGrade: integer('fullGrade').notNull(),
  passGrade: smallint('passGrade').default(0),
  correctAnswer: varchar('correctAnswer'),
  questionType: QuestionTypeEnum('questionType').notNull(),
});

export const QuizQuestionOption = pgTable('QuizQuestionOption', {
  quizeQuestionOptionId: serial('quizeQuestionOptionId').primaryKey(),
  order: integer('order').notNull(),
  questionId: integer('questionId').notNull(),
  optionText: varchar('optionText', { length: 255 }).notNull(),
  grade: integer('grade').notNull(),
});

export const QuizSubmission = pgTable('QuizSubmission', {
  quizSubmissionId: serial('quizSubmissionId').primaryKey(),
  quizId: integer('quizId').notNull(),
  studentId: integer('studentId').notNull(),
  grade: smallint('grade'),
  courseId: integer('courseId').notNull(),
  attempts: smallint('attempts'),
  submittedAt: timestamp('submittedAt', { withTimezone: true }),
  evaluatedAt: timestamp('evaluatedAt', { withTimezone: true }),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const QuizAnswer = pgTable('QuizAnswer', {
  quizAnswerId: serial('quizAnswerId').primaryKey(),
  submissionId: integer('submissionId').notNull(),
  questionId: integer('questionId').notNull(),
  answer: text('answer'),
  chosenOptionId: integer('chosenOptionId'),
  grade: smallint('grade'),
});

export const CourseProgress = pgTable('CourseProgress', {
  courseProgressId: serial('courseProgressId').primaryKey(),
  courseId: integer('courseId').notNull(),
  studentId: integer('studentId').notNull(),
  progress: integer('progress'),
});

export const CourseAttendance = pgTable('CourseAttendance', {
  courseAttendanceId: serial('courseAttendanceId').primaryKey(),
  courseId: integer('courseId').notNull(),
  userId: integer('userId')
    .references(() => UserProfile.userId)
    .notNull(),
  info: varchar('info', { length: 255 }).notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
});

export const CourseCertificate = pgTable('CourseCertificate', {
  courseCertificateId: serial('courseCertificateId').primaryKey(),
  courseId: integer('courseId').notNull(),
  userId: integer('userId')
    .references(() => UserProfile.userId)
    .notNull(),
  issueDate: timestamp('issueDate', { withTimezone: true }).notNull(),
});
