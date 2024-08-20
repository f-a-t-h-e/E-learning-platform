/*
  Warnings:

  - The values [URL,TEXT] on the enum `ContentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE] on the enum `CourseEnrollmentState` will be removed. If these variants are still used in the database, this will fail.
  - The values [OWNER,TEACHER] on the enum `CourseInstructorPositions` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE] on the enum `CourseInstructorState` will be removed. If these variants are still used in the database, this will fail.
  - The values [COURSE_BANNER,COURSE_MATERIAL,UNIT_BANNER,UNIT_MATERIAL,LESSON_BANNER,LESSON_MATERIAL] on the enum `CourseMediaTarget` will be removed. If these variants are still used in the database, this will fail.
  - The values [UPLOADING,FAILED,UPLOADED] on the enum `MediaState` will be removed. If these variants are still used in the database, this will fail.
  - The values [IMAGE,VIDEO,AUDIO,DOCUMENT] on the enum `MediaType` will be removed. If these variants are still used in the database, this will fail.
  - The values [MULTIPLE_CHOICE,TRUE_FALSE,SHORT_ANSWER,LONG_ANSWER] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `CourseEnrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CourseInstructor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `addedBy` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `marks` on the `QuizSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `addedBy` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the `LessonFeedback` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quizzesMark` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizzesMark` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CourseInstructor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizzesMark` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizzesMark` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseState" AS ENUM ('created', 'avaialble');

-- AlterEnum
BEGIN;
CREATE TYPE "ContentType_new" AS ENUM ('url', 'text');
ALTER TABLE "LessonContent" ALTER COLUMN "contentType" TYPE "ContentType_new" USING ("contentType"::text::"ContentType_new");
ALTER TYPE "ContentType" RENAME TO "ContentType_old";
ALTER TYPE "ContentType_new" RENAME TO "ContentType";
DROP TYPE "ContentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CourseEnrollmentState_new" AS ENUM ('active');
ALTER TABLE "CourseEnrollment" ALTER COLUMN "state" TYPE "CourseEnrollmentState_new" USING ("state"::text::"CourseEnrollmentState_new");
ALTER TYPE "CourseEnrollmentState" RENAME TO "CourseEnrollmentState_old";
ALTER TYPE "CourseEnrollmentState_new" RENAME TO "CourseEnrollmentState";
DROP TYPE "CourseEnrollmentState_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CourseInstructorPositions_new" AS ENUM ('owner', 'teacher');
ALTER TABLE "CourseInstructor" ALTER COLUMN "position" TYPE "CourseInstructorPositions_new" USING ("position"::text::"CourseInstructorPositions_new");
ALTER TYPE "CourseInstructorPositions" RENAME TO "CourseInstructorPositions_old";
ALTER TYPE "CourseInstructorPositions_new" RENAME TO "CourseInstructorPositions";
DROP TYPE "CourseInstructorPositions_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CourseInstructorState_new" AS ENUM ('active');
ALTER TABLE "CourseInstructor" ALTER COLUMN "state" TYPE "CourseInstructorState_new" USING ("state"::text::"CourseInstructorState_new");
ALTER TYPE "CourseInstructorState" RENAME TO "CourseInstructorState_old";
ALTER TYPE "CourseInstructorState_new" RENAME TO "CourseInstructorState";
DROP TYPE "CourseInstructorState_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CourseMediaTarget_new" AS ENUM ('course_banner', 'course_material', 'unit_banner', 'unit_material', 'lesson_banner', 'lesson_material');
ALTER TABLE "CourseMedia" ALTER COLUMN "target" TYPE "CourseMediaTarget_new" USING ("target"::text::"CourseMediaTarget_new");
ALTER TYPE "CourseMediaTarget" RENAME TO "CourseMediaTarget_old";
ALTER TYPE "CourseMediaTarget_new" RENAME TO "CourseMediaTarget";
DROP TYPE "CourseMediaTarget_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MediaState_new" AS ENUM ('uploading', 'uploaded', 'failed');
ALTER TABLE "CourseMedia" ALTER COLUMN "state" TYPE "MediaState_new" USING ("state"::text::"MediaState_new");
ALTER TYPE "MediaState" RENAME TO "MediaState_old";
ALTER TYPE "MediaState_new" RENAME TO "MediaState";
DROP TYPE "MediaState_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MediaType_new" AS ENUM ('image', 'video', 'audio', 'document');
ALTER TABLE "CourseMedia" ALTER COLUMN "type" TYPE "MediaType_new" USING ("type"::text::"MediaType_new");
ALTER TYPE "MediaType" RENAME TO "MediaType_old";
ALTER TYPE "MediaType_new" RENAME TO "MediaType";
DROP TYPE "MediaType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'long_answer');
ALTER TABLE "QuizQuestion" ALTER COLUMN "questionType" TYPE "QuestionType_new" USING ("questionType"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "LessonFeedback" DROP CONSTRAINT "LessonFeedback_courseId_fkey";

-- DropForeignKey
ALTER TABLE "LessonFeedback" DROP CONSTRAINT "LessonFeedback_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "LessonFeedback" DROP CONSTRAINT "LessonFeedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_addedBy_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "attendanceMark" INTEGER,
ADD COLUMN     "quizzesMark" INTEGER NOT NULL,
ADD COLUMN     "state" "CourseState" NOT NULL;

-- AlterTable
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_pkey",
ADD COLUMN     "attendanceMark" INTEGER,
ADD COLUMN     "courseEnrollmentId" SERIAL NOT NULL,
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "quizzesMark" INTEGER NOT NULL,
ADD CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("courseEnrollmentId");

-- AlterTable
ALTER TABLE "CourseInstructor" DROP CONSTRAINT "CourseInstructor_pkey",
ADD COLUMN     "courseInstructorId" SERIAL NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL,
ADD CONSTRAINT "CourseInstructor_pkey" PRIMARY KEY ("courseInstructorId");

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "addedBy",
ADD COLUMN     "attendanceMark" SMALLINT,
ADD COLUMN     "quizzesMark" SMALLINT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "QuizSubmission" DROP COLUMN "marks",
ADD COLUMN     "mark" SMALLINT;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "addedBy",
ADD COLUMN     "attendanceMark" INTEGER,
ADD COLUMN     "quizzesMark" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "LessonFeedback";

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
