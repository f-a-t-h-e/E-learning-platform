import {
  pgTable,
  timestamp,
  text,
  integer,
  uniqueIndex,
  foreignKey,
  serial,
  bigint,
  smallint,
  doublePrecision,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import {
  contentType,
  courseEnrollmentState,
  courseInstructorPositions,
  courseInstructorState,
  courseMediaTarget,
  courseState,
  lessonState,
  mediaState,
  mediaType,
  questionType,
  quizReviewType,
  quizState,
  quizType,
  unitState,
} from './enums';

export const role = pgTable('Role', {
  name: text('name').notNull(),
});

export const user = pgTable(
  'User',
  {
    userId: serial('userId').primaryKey().notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    roleName: text('roleName').notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      emailKey: uniqueIndex('User_email_key').using(
        'btree',
        table.email.asc().nullsLast(),
      ),
      userRoleNameFkey: foreignKey({
        columns: [table.roleName],
        foreignColumns: [role.name],
        name: 'User_roleName_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const session = pgTable(
  'Session',
  {
    sessionId: serial('sessionId').primaryKey().notNull(),
    refreshToken: text('refreshToken').notNull(),
    userId: integer('userId').notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    expiresAt: timestamp('expiresAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      sessionUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.userId],
        name: 'Session_userId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const userProfile = pgTable(
  'UserProfile',
  {
    userId: integer('userId').notNull(),
    username: text('username').notNull(),
    firstName: text('firstName').notNull(),
    secondName: text('secondName'),
    thirdName: text('thirdName'),
    lastName: text('lastName').notNull(),
    bio: text('bio'),
    avatar: text('avatar'),
    banner: text('banner'),
    phone: text('phone'),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      usernameKey: uniqueIndex('UserProfile_username_key').using(
        'btree',
        table.username.asc().nullsLast(),
      ),
      userProfileUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.userId],
        name: 'UserProfile_userId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const course = pgTable('Course', {
  courseId: serial('courseId').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  banner: text('banner'),
  quizFullGrade: integer('quizFullGrade').default(0).notNull(),
  quizPassGrade: integer('quizPassGrade'),
  state: courseState('state').default('created').notNull(),
  createdAt: timestamp('createdAt', {
    precision: 3,
    withTimezone: true,
    mode: 'date',
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    precision: 3,
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const courseEnrollment = pgTable(
  'CourseEnrollment',
  {
    courseEnrollmentId: serial('courseEnrollmentId').primaryKey().notNull(),
    courseId: integer('courseId').notNull(),
    studentId: integer('studentId').notNull(),
    state: courseEnrollmentState('state').notNull(),
    quizGrade: integer('quizGrade').notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    endsAt: timestamp('endsAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }),
  },
  (table) => {
    return {
      courseEnrollmentCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'CourseEnrollment_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      courseEnrollmentStudentIdFkey: foreignKey({
        columns: [table.studentId],
        foreignColumns: [userProfile.userId],
        name: 'CourseEnrollment_studentId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const courseInstructor = pgTable(
  'CourseInstructor',
  {
    courseInstructorId: serial('courseInstructorId').primaryKey().notNull(),
    courseId: integer('courseId').notNull(),
    instructorId: integer('instructorId').notNull(),
    position: courseInstructorPositions('position').notNull(),
    state: courseInstructorState('state').notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    endsAt: timestamp('endsAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }),
  },
  (table) => {
    return {
      courseInstructorCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'CourseInstructor_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      courseInstructorInstructorIdFkey: foreignKey({
        columns: [table.instructorId],
        foreignColumns: [userProfile.userId],
        name: 'CourseInstructor_instructorId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const courseMedia = pgTable(
  'CourseMedia',
  {
    courseMediaId: serial('courseMediaId').primaryKey().notNull(),
    url: text('url').notNull(),
    type: mediaType('type').notNull(),
    extension: text('extension').notNull(),
    state: mediaState('state').notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    bytes: bigint('bytes', { mode: 'number' }).notNull(),
    userId: integer('userId').notNull(),
    courseId: integer('courseId'),
    unitId: integer('unitId'),
    lessonId: integer('lessonId'),
    target: courseMediaTarget('target').notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      courseMediaUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [userProfile.userId],
        name: 'CourseMedia_userId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      courseMediaCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'CourseMedia_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
      courseMediaUnitIdFkey: foreignKey({
        columns: [table.unitId],
        foreignColumns: [unit.unitId],
        name: 'CourseMedia_unitId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
      courseMediaLessonIdFkey: foreignKey({
        columns: [table.lessonId],
        foreignColumns: [lesson.lessonId],
        name: 'CourseMedia_lessonId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
    };
  },
);

export const unit = pgTable(
  'Unit',
  {
    unitId: serial('unitId').primaryKey().notNull(),
    order: smallint('order').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    banner: text('banner'),
    quizFullGrade: integer('quizFullGrade').default(0).notNull(),
    quizPassGrade: integer('quizPassGrade'),
    courseId: integer('courseId').notNull(),
    userId: integer('userId').notNull(),
    state: unitState('state').default('created').notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      unitCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'Unit_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      unitUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [userProfile.userId],
        name: 'Unit_userId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const lesson = pgTable(
  'Lesson',
  {
    lessonId: serial('lessonId').primaryKey().notNull(),
    order: smallint('order').notNull(),
    title: text('title').notNull(),
    banner: text('banner'),
    description: text('description'),
    quizFullGrade: smallint('quizFullGrade').default(0).notNull(),
    quizPassGrade: smallint('quizPassGrade'),
    unitId: integer('unitId').notNull(),
    userId: integer('userId').notNull(),
    courseId: integer('courseId').notNull(),
    state: lessonState('state').default('created').notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      lessonUnitIdFkey: foreignKey({
        columns: [table.unitId],
        foreignColumns: [unit.unitId],
        name: 'Lesson_unitId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      lessonUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [userProfile.userId],
        name: 'Lesson_userId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      lessonCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'Lesson_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const lessonContent = pgTable(
  'LessonContent',
  {
    lessonId: integer('lessonId').primaryKey().notNull(),
    contentType: contentType('contentType').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      lessonContentLessonIdFkey: foreignKey({
        columns: [table.lessonId],
        foreignColumns: [lesson.lessonId],
        name: 'LessonContent_lessonId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const quiz = pgTable(
  'Quiz',
  {
    quizId: serial('quizId').primaryKey().notNull(),
    order: smallint('order').notNull(),
    courseId: integer('courseId').notNull(),
    title: text('title').notNull(),
    unitId: integer('unitId'),
    lessonId: integer('lessonId'),
    state: quizState('state').default('created').notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      quizCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'Quiz_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      quizUnitIdFkey: foreignKey({
        columns: [table.unitId],
        foreignColumns: [unit.unitId],
        name: 'Quiz_unitId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
      quizLessonIdFkey: foreignKey({
        columns: [table.lessonId],
        foreignColumns: [lesson.lessonId],
        name: 'Quiz_lessonId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
    };
  },
);

export const quizMetaData = pgTable(
  'QuizMetaData',
  {
    quizId: integer('quizId').notNull(),
    fullGrade: smallint('fullGrade').default(0).notNull(),
    passGrade: smallint('passGrade').default(0),
    attemptsAllowed: smallint('attemptsAllowed'),
    reviewType: quizReviewType('reviewType').notNull(),
    type: quizType('type').notNull(),
    startsAt: timestamp('startsAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    endsAt: timestamp('endsAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }),
    lateSubmissionDate: timestamp('lateSubmissionDate', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }),
  },
  (table) => {
    return {
      quizIdKey: uniqueIndex('QuizMetaData_quizId_key').using(
        'btree',
        table.quizId.asc().nullsLast(),
      ),
      quizMetaDataQuizIdFkey: foreignKey({
        columns: [table.quizId],
        foreignColumns: [quiz.quizId],
        name: 'QuizMetaData_quizId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const quizQuestion = pgTable(
  'QuizQuestion',
  {
    quizQuestionId: serial('quizQuestionId').primaryKey().notNull(),
    order: smallint('order').notNull(),
    quizId: integer('quizId').notNull(),
    questionText: text('questionText').notNull(),
    fullGrade: smallint('fullGrade').default(0).notNull(),
    passGrade: smallint('passGrade').default(0),
    correctAnswer: text('correctAnswer'),
    questionType: questionType('questionType').notNull(),
  },
  (table) => {
    return {
      quizQuestionQuizIdFkey: foreignKey({
        columns: [table.quizId],
        foreignColumns: [quiz.quizId],
        name: 'QuizQuestion_quizId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const quizQuestionOption = pgTable(
  'QuizQuestionOption',
  {
    quizeQuestionOptionId: serial('quizeQuestionOptionId')
      .primaryKey()
      .notNull(),
    order: smallint('order').default(1).notNull(),
    questionId: integer('questionId').notNull(),
    optionText: text('optionText').notNull(),
    grade: smallint('grade').default(0).notNull(),
  },
  (table) => {
    return {
      quizQuestionOptionQuestionIdFkey: foreignKey({
        columns: [table.questionId],
        foreignColumns: [quizQuestion.quizQuestionId],
        name: 'QuizQuestionOption_questionId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const quizSubmission = pgTable(
  'QuizSubmission',
  {
    quizSubmissionId: serial('quizSubmissionId').primaryKey().notNull(),
    quizId: integer('quizId').notNull(),
    studentId: integer('studentId').notNull(),
    grade: smallint('grade'),
    courseId: integer('courseId').notNull(),
    attempts: smallint('attempts'),
    createdAt: timestamp('createdAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    submittedAt: timestamp('submittedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }),
    reviewedAt: timestamp('reviewedAt', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }),
  },
  (table) => {
    return {
      quizSubmissionQuizIdFkey: foreignKey({
        columns: [table.quizId],
        foreignColumns: [quiz.quizId],
        name: 'QuizSubmission_quizId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      quizSubmissionStudentIdFkey: foreignKey({
        columns: [table.studentId],
        foreignColumns: [userProfile.userId],
        name: 'QuizSubmission_studentId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      quizSubmissionCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'QuizSubmission_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const quizAnswer = pgTable(
  'QuizAnswer',
  {
    quizAnswerId: serial('quizAnswerId').primaryKey().notNull(),
    submissionId: integer('submissionId').notNull(),
    questionId: integer('questionId').notNull(),
    answer: text('answer'),
    chosenOptionId: integer('chosenOptionId'),
    grade: smallint('grade'),
  },
  (table) => {
    return {
      quizAnswerChosenOptionIdFkey: foreignKey({
        columns: [table.chosenOptionId],
        foreignColumns: [quizQuestionOption.quizeQuestionOptionId],
        name: 'QuizAnswer_chosenOptionId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
      quizAnswerSubmissionIdFkey: foreignKey({
        columns: [table.submissionId],
        foreignColumns: [quizSubmission.quizSubmissionId],
        name: 'QuizAnswer_submissionId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      quizAnswerQuestionIdFkey: foreignKey({
        columns: [table.questionId],
        foreignColumns: [quizQuestion.quizQuestionId],
        name: 'QuizAnswer_questionId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const courseProgress = pgTable(
  'CourseProgress',
  {
    courseProgressId: serial('courseProgressId').primaryKey().notNull(),
    courseId: integer('courseId').notNull(),
    studentId: integer('studentId').notNull(),
    progress: doublePrecision('progress').notNull(),
  },
  (table) => {
    return {
      courseProgressCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'CourseProgress_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      courseProgressStudentIdFkey: foreignKey({
        columns: [table.studentId],
        foreignColumns: [userProfile.userId],
        name: 'CourseProgress_studentId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const courseAttendance = pgTable(
  'CourseAttendance',
  {
    courseAttendanceId: serial('courseAttendanceId').primaryKey().notNull(),
    courseId: integer('courseId').notNull(),
    userId: integer('userId').notNull(),
    info: text('info').notNull(),
    date: timestamp('date', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      courseAttendanceCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'CourseAttendance_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      courseAttendanceUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [userProfile.userId],
        name: 'CourseAttendance_userId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export const courseCertificate = pgTable(
  'CourseCertificate',
  {
    courseCertificateId: serial('courseCertificateId').primaryKey().notNull(),
    courseId: integer('courseId').notNull(),
    userId: integer('userId').notNull(),
    issueDate: timestamp('issueDate', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => {
    return {
      courseCertificateCourseIdFkey: foreignKey({
        columns: [table.courseId],
        foreignColumns: [course.courseId],
        name: 'CourseCertificate_courseId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
      courseCertificateUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [userProfile.userId],
        name: 'CourseCertificate_userId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);
