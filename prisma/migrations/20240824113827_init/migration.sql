-- CreateEnum
CREATE TYPE "CourseState" AS ENUM ('created', 'available', 'calculatedGrades');

-- CreateEnum
CREATE TYPE "CourseEnrollmentState" AS ENUM ('active');

-- CreateEnum
CREATE TYPE "CourseInstructorPositions" AS ENUM ('owner', 'teacher');

-- CreateEnum
CREATE TYPE "CourseInstructorState" AS ENUM ('active');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'audio', 'document');

-- CreateEnum
CREATE TYPE "MediaState" AS ENUM ('uploading', 'uploaded', 'failed');

-- CreateEnum
CREATE TYPE "CourseMediaTarget" AS ENUM ('course_banner', 'course_material', 'unit_banner', 'unit_material', 'lesson_banner', 'lesson_material');

-- CreateEnum
CREATE TYPE "UnitState" AS ENUM ('created', 'available', 'calculatedGrades');

-- CreateEnum
CREATE TYPE "LessonState" AS ENUM ('created', 'available', 'calculatedGrades');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('url', 'text');

-- CreateEnum
CREATE TYPE "QuizState" AS ENUM ('created', 'available', 'calculatedGrades');

-- CreateEnum
CREATE TYPE "QuizReviewType" AS ENUM ('automatic', 'manual', 'both');

-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('randomized', 'sequential', 'randomizedTimed', 'sequentialTimed');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'long_answer');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionId" SERIAL NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT,
    "thirdName" TEXT,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "banner" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Course" (
    "courseId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "banner" TEXT,
    "quizFullGrade" INTEGER NOT NULL DEFAULT 0,
    "quizPassGrade" INTEGER,
    "state" "CourseState" NOT NULL DEFAULT 'created',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "CourseEnrollment" (
    "courseEnrollmentId" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "state" "CourseEnrollmentState" NOT NULL,
    "quizGrade" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMP(3),

    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("courseEnrollmentId")
);

-- CreateTable
CREATE TABLE "CourseInstructor" (
    "courseInstructorId" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "position" "CourseInstructorPositions" NOT NULL,
    "state" "CourseInstructorState" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMP(3),

    CONSTRAINT "CourseInstructor_pkey" PRIMARY KEY ("courseInstructorId")
);

-- CreateTable
CREATE TABLE "CourseMedia" (
    "courseMediaId" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "extension" TEXT NOT NULL,
    "state" "MediaState" NOT NULL,
    "bytes" BIGINT NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER,
    "unitId" INTEGER,
    "lessonId" INTEGER,
    "target" "CourseMediaTarget" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CourseMedia_pkey" PRIMARY KEY ("courseMediaId")
);

-- CreateTable
CREATE TABLE "Unit" (
    "unitId" SERIAL NOT NULL,
    "order" SMALLINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "banner" TEXT,
    "quizFullGrade" INTEGER NOT NULL DEFAULT 0,
    "quizPassGrade" INTEGER,
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "state" "UnitState" NOT NULL DEFAULT 'created',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("unitId")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "lessonId" SERIAL NOT NULL,
    "order" SMALLINT NOT NULL,
    "title" TEXT NOT NULL,
    "banner" TEXT,
    "description" TEXT,
    "quizFullGrade" SMALLINT NOT NULL DEFAULT 0,
    "quizPassGrade" SMALLINT,
    "unitId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "state" "LessonState" NOT NULL DEFAULT 'created',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("lessonId")
);

-- CreateTable
CREATE TABLE "LessonContent" (
    "lessonId" INTEGER NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "LessonContent_pkey" PRIMARY KEY ("lessonId")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "quizId" SERIAL NOT NULL,
    "order" SMALLINT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "unitId" INTEGER,
    "lessonId" INTEGER,
    "state" "QuizState" NOT NULL DEFAULT 'created',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("quizId")
);

-- CreateTable
CREATE TABLE "QuizMetaData" (
    "quizId" INTEGER NOT NULL,
    "fullGrade" SMALLINT NOT NULL DEFAULT 0,
    "passGrade" SMALLINT DEFAULT 0,
    "attemptsAllowed" SMALLINT,
    "reviewType" "QuizReviewType" NOT NULL,
    "type" "QuizType" NOT NULL,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3),
    "lateSubmissionDate" TIMESTAMPTZ(3)
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "quizQuestionId" SERIAL NOT NULL,
    "order" SMALLINT NOT NULL,
    "quizId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "fullGrade" SMALLINT NOT NULL DEFAULT 0,
    "passGrade" SMALLINT DEFAULT 0,
    "correctAnswer" TEXT,
    "questionType" "QuestionType" NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("quizQuestionId")
);

-- CreateTable
CREATE TABLE "QuizQuestionOption" (
    "quizeQuestionOptionId" SERIAL NOT NULL,
    "order" SMALLINT NOT NULL DEFAULT 1,
    "questionId" INTEGER NOT NULL,
    "optionText" TEXT NOT NULL,
    "grade" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "QuizQuestionOption_pkey" PRIMARY KEY ("quizeQuestionOptionId")
);

-- CreateTable
CREATE TABLE "QuizSubmission" (
    "quizSubmissionId" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "grade" SMALLINT,
    "attempts" SMALLINT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMPTZ(3),
    "reviewedAt" TIMESTAMPTZ(3),

    CONSTRAINT "QuizSubmission_pkey" PRIMARY KEY ("quizSubmissionId")
);

-- CreateTable
CREATE TABLE "QuizAnswer" (
    "quizAnswerId" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT,
    "chosenOptionId" INTEGER,
    "grade" SMALLINT,

    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("quizAnswerId")
);

-- CreateTable
CREATE TABLE "CourseProgress" (
    "courseProgressId" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("courseProgressId")
);

-- CreateTable
CREATE TABLE "CourseAttendance" (
    "courseAttendanceId" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "info" TEXT NOT NULL,
    "date" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CourseAttendance_pkey" PRIMARY KEY ("courseAttendanceId")
);

-- CreateTable
CREATE TABLE "CourseCertificate" (
    "courseCertificateId" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "issueDate" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CourseCertificate_pkey" PRIMARY KEY ("courseCertificateId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_username_key" ON "UserProfile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "QuizMetaData_quizId_key" ON "QuizMetaData"("quizId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleName_fkey" FOREIGN KEY ("roleName") REFERENCES "Role"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInstructor" ADD CONSTRAINT "CourseInstructor_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInstructor" ADD CONSTRAINT "CourseInstructor_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMedia" ADD CONSTRAINT "CourseMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMedia" ADD CONSTRAINT "CourseMedia_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMedia" ADD CONSTRAINT "CourseMedia_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("unitId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMedia" ADD CONSTRAINT "CourseMedia_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("lessonId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("unitId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonContent" ADD CONSTRAINT "LessonContent_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("lessonId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("unitId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("lessonId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizMetaData" ADD CONSTRAINT "QuizMetaData_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestionOption" ADD CONSTRAINT "QuizQuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("quizQuestionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_chosenOptionId_fkey" FOREIGN KEY ("chosenOptionId") REFERENCES "QuizQuestionOption"("quizeQuestionOptionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "QuizSubmission"("quizSubmissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("quizQuestionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAttendance" ADD CONSTRAINT "CourseAttendance_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAttendance" ADD CONSTRAINT "CourseAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCertificate" ADD CONSTRAINT "CourseCertificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCertificate" ADD CONSTRAINT "CourseCertificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
