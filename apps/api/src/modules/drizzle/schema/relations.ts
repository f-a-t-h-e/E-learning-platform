import { relations } from 'drizzle-orm/relations';
import {
  role,
  user,
  session,
  userProfile,
  course,
  courseEnrollment,
  courseInstructor,
  courseMedia,
  unit,
  lesson,
  lessonContent,
  quiz,
  quizMetaData,
  quizQuestion,
  quizQuestionOption,
  quizSubmission,
  quizAnswer,
  courseProgress,
  courseAttendance,
  courseCertificate,
} from './tables';

export const userRelations = relations(user, ({ one, many }) => ({
  role: one(role, {
    fields: [user.roleName],
    references: [role.name],
  }),
  sessions: many(session),
  userProfiles: many(userProfile),
}));

export const roleRelations = relations(role, ({ many }) => ({
  users: many(user),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.userId],
  }),
}));

export const userProfileRelations = relations(userProfile, ({ one, many }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.userId],
  }),
  courseEnrollments: many(courseEnrollment),
  courseInstructors: many(courseInstructor),
  courseMedias: many(courseMedia),
  units: many(unit),
  lessons: many(lesson),
  quizSubmissions: many(quizSubmission),
  courseProgresses: many(courseProgress),
  courseAttendances: many(courseAttendance),
  courseCertificates: many(courseCertificate),
}));

export const courseEnrollmentRelations = relations(
  courseEnrollment,
  ({ one }) => ({
    course: one(course, {
      fields: [courseEnrollment.courseId],
      references: [course.courseId],
    }),
    userProfile: one(userProfile, {
      fields: [courseEnrollment.studentId],
      references: [userProfile.userId],
    }),
  }),
);

export const courseRelations = relations(course, ({ many }) => ({
  courseEnrollments: many(courseEnrollment),
  courseInstructors: many(courseInstructor),
  courseMedias: many(courseMedia),
  units: many(unit),
  lessons: many(lesson),
  quizzes: many(quiz),
  quizSubmissions: many(quizSubmission),
  courseProgresses: many(courseProgress),
  courseAttendances: many(courseAttendance),
  courseCertificates: many(courseCertificate),
}));

export const courseInstructorRelations = relations(
  courseInstructor,
  ({ one }) => ({
    course: one(course, {
      fields: [courseInstructor.courseId],
      references: [course.courseId],
    }),
    userProfile: one(userProfile, {
      fields: [courseInstructor.instructorId],
      references: [userProfile.userId],
    }),
  }),
);

export const courseMediaRelations = relations(courseMedia, ({ one }) => ({
  userProfile: one(userProfile, {
    fields: [courseMedia.userId],
    references: [userProfile.userId],
  }),
  course: one(course, {
    fields: [courseMedia.courseId],
    references: [course.courseId],
  }),
  unit: one(unit, {
    fields: [courseMedia.unitId],
    references: [unit.unitId],
  }),
  lesson: one(lesson, {
    fields: [courseMedia.lessonId],
    references: [lesson.lessonId],
  }),
}));

export const unitRelations = relations(unit, ({ one, many }) => ({
  courseMedias: many(courseMedia),
  course: one(course, {
    fields: [unit.courseId],
    references: [course.courseId],
  }),
  userProfile: one(userProfile, {
    fields: [unit.userId],
    references: [userProfile.userId],
  }),
  lessons: many(lesson),
  quizzes: many(quiz),
}));

export const lessonRelations = relations(lesson, ({ one, many }) => ({
  courseMedias: many(courseMedia),
  unit: one(unit, {
    fields: [lesson.unitId],
    references: [unit.unitId],
  }),
  userProfile: one(userProfile, {
    fields: [lesson.userId],
    references: [userProfile.userId],
  }),
  course: one(course, {
    fields: [lesson.courseId],
    references: [course.courseId],
  }),
  lessonContents: many(lessonContent),
  quizzes: many(quiz),
}));

export const lessonContentRelations = relations(lessonContent, ({ one }) => ({
  lesson: one(lesson, {
    fields: [lessonContent.lessonId],
    references: [lesson.lessonId],
  }),
}));

export const quizRelations = relations(quiz, ({ one, many }) => ({
  course: one(course, {
    fields: [quiz.courseId],
    references: [course.courseId],
  }),
  unit: one(unit, {
    fields: [quiz.unitId],
    references: [unit.unitId],
  }),
  lesson: one(lesson, {
    fields: [quiz.lessonId],
    references: [lesson.lessonId],
  }),
  quizMetaData: many(quizMetaData),
  quizQuestions: many(quizQuestion),
  quizSubmissions: many(quizSubmission),
}));

export const quizMetaDataRelations = relations(quizMetaData, ({ one }) => ({
  quiz: one(quiz, {
    fields: [quizMetaData.quizId],
    references: [quiz.quizId],
  }),
}));

export const quizQuestionRelations = relations(
  quizQuestion,
  ({ one, many }) => ({
    quiz: one(quiz, {
      fields: [quizQuestion.quizId],
      references: [quiz.quizId],
    }),
    quizQuestionOptions: many(quizQuestionOption),
    quizAnswers: many(quizAnswer),
  }),
);

export const quizQuestionOptionRelations = relations(
  quizQuestionOption,
  ({ one, many }) => ({
    quizQuestion: one(quizQuestion, {
      fields: [quizQuestionOption.questionId],
      references: [quizQuestion.quizQuestionId],
    }),
    quizAnswers: many(quizAnswer),
  }),
);

export const quizSubmissionRelations = relations(
  quizSubmission,
  ({ one, many }) => ({
    quiz: one(quiz, {
      fields: [quizSubmission.quizId],
      references: [quiz.quizId],
    }),
    userProfile: one(userProfile, {
      fields: [quizSubmission.studentId],
      references: [userProfile.userId],
    }),
    course: one(course, {
      fields: [quizSubmission.courseId],
      references: [course.courseId],
    }),
    quizAnswers: many(quizAnswer),
  }),
);

export const quizAnswerRelations = relations(quizAnswer, ({ one }) => ({
  quizQuestionOption: one(quizQuestionOption, {
    fields: [quizAnswer.chosenOptionId],
    references: [quizQuestionOption.quizeQuestionOptionId],
  }),
  quizSubmission: one(quizSubmission, {
    fields: [quizAnswer.submissionId],
    references: [quizSubmission.quizSubmissionId],
  }),
  quizQuestion: one(quizQuestion, {
    fields: [quizAnswer.questionId],
    references: [quizQuestion.quizQuestionId],
  }),
}));

export const courseProgressRelations = relations(courseProgress, ({ one }) => ({
  course: one(course, {
    fields: [courseProgress.courseId],
    references: [course.courseId],
  }),
  userProfile: one(userProfile, {
    fields: [courseProgress.studentId],
    references: [userProfile.userId],
  }),
}));

export const courseAttendanceRelations = relations(
  courseAttendance,
  ({ one }) => ({
    course: one(course, {
      fields: [courseAttendance.courseId],
      references: [course.courseId],
    }),
    userProfile: one(userProfile, {
      fields: [courseAttendance.userId],
      references: [userProfile.userId],
    }),
  }),
);

export const courseCertificateRelations = relations(
  courseCertificate,
  ({ one }) => ({
    course: one(course, {
      fields: [courseCertificate.courseId],
      references: [course.courseId],
    }),
    userProfile: one(userProfile, {
      fields: [courseCertificate.userId],
      references: [userProfile.userId],
    }),
  }),
);
