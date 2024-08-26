import { relations } from 'drizzle-orm';
import {
  Course,
  CourseAttendance,
  CourseCertificate,
  CourseEnrollment,
  CourseInstructor,
  CourseMedia,
  CourseProgress,
  Lesson,
  LessonContent,
  Quiz,
  QuizAnswer,
  QuizMetaData,
  QuizQuestion,
  QuizQuestionOption,
  QuizSubmission,
  Role,
  Session,
  Unit,
  User,
  UserProfile,
} from './tables';

export const userRelations = relations(User, ({ one, many }) => ({
  Role: one(Role, {
    fields: [User.roleName],
    references: [Role.name],
  }),
  Sessions: many(Session),
  Profile: one(UserProfile, {
    fields: [User.userId],
    references: [UserProfile.userId],
  }),
}));

export const sessionRelations = relations(Session, ({ one }) => ({
  User: one(User, {
    fields: [Session.userId],
    references: [User.userId],
  }),
}));

export const userProfileRelations = relations(UserProfile, ({ many, one }) => ({
  User: one(User, {
    fields: [UserProfile.userId],
    references: [User.userId],
  }),
  UploadedMedia: many(CourseMedia),
  Attendance: many(CourseAttendance),
  CreatedUnits: many(Unit),
  CreatedLessons: many(Lesson),
  InstructoreCourses: many(CourseInstructor),
  CoursesProgress: many(CourseProgress),
  Certificates: many(CourseCertificate),
  QuizSubmissions: many(QuizSubmission),
  CoursesEnrollment: many(CourseEnrollment),
}));

export const roleRelations = relations(Role, ({ many }) => ({
  Users: many(User),
}));

export const courseRelations = relations(Course, ({ many }) => ({
  Units: many(Unit),
  Lessons: many(Lesson),
  Media: many(CourseMedia),
  Students: many(CourseEnrollment),
  Instructors: many(CourseInstructor),
  Attendance: many(CourseAttendance),
  StudentsProgress: many(CourseProgress),
  Quizzes: many(Quiz),
  Certificates: many(CourseCertificate),
  QuizSubmissions: many(QuizSubmission),
}));

export const courseEnrollmentRelations = relations(
  CourseEnrollment,
  ({ one }) => ({
    Course: one(Course, {
      fields: [CourseEnrollment.courseId],
      references: [Course.courseId],
    }),
    Student: one(UserProfile, {
      fields: [CourseEnrollment.studentId],
      references: [UserProfile.userId],
    }),
  }),
);

export const courseInstructorRelations = relations(
  CourseInstructor,
  ({ one }) => ({
    Course: one(Course, {
      fields: [CourseInstructor.courseId],
      references: [Course.courseId],
    }),
    Instructor: one(UserProfile, {
      fields: [CourseInstructor.instructorId],
      references: [UserProfile.userId],
    }),
  }),
);

export const unitRelations = relations(Unit, ({ many, one }) => ({
  Course: one(Course, {
    fields: [Unit.courseId],
    references: [Course.courseId],
  }),
  AddedBy: one(UserProfile, {
    fields: [Unit.userId],
    references: [UserProfile.userId],
  }),
  Lessons: many(Lesson),
  Quizzes: many(Quiz),
  Media: many(CourseMedia),
}));

export const lessonRelations = relations(Lesson, ({ many, one }) => ({
  Course: one(Course, {
    fields: [Lesson.courseId],
    references: [Course.courseId],
  }),
  Unit: one(Unit, {
    fields: [Lesson.unitId],
    references: [Unit.unitId],
  }),
  LessonContent: one(LessonContent, {
    fields: [Lesson.lessonId],
    references: [LessonContent.lessonId],
  }),
  Media: many(CourseMedia),
  Quizzes: many(Quiz),
}));

export const lessonContentRelations = relations(LessonContent, ({ one }) => ({
  Lesson: one(Lesson, {
    fields: [LessonContent.lessonId],
    references: [Lesson.lessonId],
  }),
}));

export const quizRelations = relations(Quiz, ({ many, one }) => ({
  Course: one(Course, {
    fields: [Quiz.courseId],
    references: [Course.courseId],
  }),
  Unit: one(Unit, {
    fields: [Quiz.unitId],
    references: [Unit.unitId],
  }),
  Lesson: one(Lesson, {
    fields: [Quiz.lessonId],
    references: [Lesson.lessonId],
  }),
  QuizMetaData: one(QuizMetaData, {
    fields: [Quiz.quizId],
    references: [QuizMetaData.quizId],
  }),
  Questions: many(QuizQuestion),
  QuizSubmissions: many(QuizSubmission),
}));

export const quizMetaDataRelations = relations(QuizMetaData, ({ one }) => ({
  Quiz: one(Quiz, {
    fields: [QuizMetaData.quizId],
    references: [Quiz.quizId],
  }),
  //   Questions: many(QuizQuestion),
  //   QuizSubmissions: many(QuizSubmission),
}));

export const quizQuestionRelations = relations(
  QuizQuestion,
  ({ many, one }) => ({
    Quiz: one(Quiz, {
      fields: [QuizQuestion.quizId],
      references: [Quiz.quizId],
    }),

    Options: many(QuizQuestionOption),
    QuizAnswer: many(QuizAnswer),
  }),
);

export const quizQuestionOptionRelations = relations(
  QuizQuestionOption,
  ({ many, one }) => ({
    Question: one(QuizQuestion, {
      fields: [QuizQuestionOption.questionId],
      references: [QuizQuestion.quizQuestionId],
    }),
    ChosenByAnswers: many(QuizAnswer),
  }),
);

export const quizSubmissionRelations = relations(
  QuizSubmission,
  ({ many, one }) => ({
    Student: one(UserProfile, {
      fields: [QuizSubmission.studentId],
      references: [UserProfile.userId],
    }),
    Course: one(Course, {
      fields: [QuizSubmission.courseId],
      references: [Course.courseId],
    }),
    Quiz: one(Quiz, {
      fields: [QuizSubmission.quizId],
      references: [Quiz.quizId],
    }),
    Answers: many(QuizAnswer),
  }),
);
export const quizAnswerRelations = relations(QuizAnswer, ({ one }) => ({
  ChosenOption: one(QuizQuestionOption, {
    fields: [QuizAnswer.chosenOptionId],
    references: [QuizQuestionOption.quizeQuestionOptionId],
  }),
  Submission: one(QuizSubmission, {
    fields: [QuizAnswer.submissionId],
    references: [QuizSubmission.quizSubmissionId],
  }),
  Question: one(QuizQuestion, {
    fields: [QuizAnswer.questionId],
    references: [QuizQuestion.quizQuestionId],
  }),
}));


