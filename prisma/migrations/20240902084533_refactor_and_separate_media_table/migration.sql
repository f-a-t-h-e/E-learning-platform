/*
  Warnings:

  - You are about to drop the column `lessonId` on the `CourseMedia` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `CourseMedia` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `CourseMedia` table. All the data in the column will be lost.
  - Added the required column `purpose` to the `CourseMedia` table without a default value. This is not possible if the table is not empty.
  - Made the column `courseId` on table `CourseMedia` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserProfileMediaPurpose" AS ENUM ('profile_banner', 'profile_photo');

-- CreateEnum
CREATE TYPE "CourseMediaPurpose" AS ENUM ('course_banner', 'course_material');

-- CreateEnum
CREATE TYPE "UnitMediaPurpose" AS ENUM ('unit_banner', 'unit_material');

-- CreateEnum
CREATE TYPE "LessonMediaPurpose" AS ENUM ('lesson_banner', 'lesson_material');

-- CreateEnum
CREATE TYPE "QuizMediaPurpose" AS ENUM ('quiz_banner', 'quiz_material');

-- CreateEnum
CREATE TYPE "QuizSubmissionMediaPurpose" AS ENUM ('full_quiz_answers', 'single_question_answer', 'part_of_the_quiz_answers');

-- DropForeignKey
ALTER TABLE "CourseMedia" DROP CONSTRAINT "CourseMedia_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseMedia" DROP CONSTRAINT "CourseMedia_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "CourseMedia" DROP CONSTRAINT "CourseMedia_unitId_fkey";

-- AlterTable
ALTER TABLE "CourseMedia" DROP COLUMN "lessonId",
DROP COLUMN "target",
DROP COLUMN "unitId",
ADD COLUMN     "purpose" "CourseMediaPurpose" NOT NULL,
ALTER COLUMN "courseId" SET NOT NULL;

-- DropEnum
DROP TYPE "CourseMediaTarget";

-- CreateTable
CREATE TABLE "UserProfileMedia" (
    "userProfileMediaId" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "extension" TEXT NOT NULL,
    "state" "MediaState" NOT NULL,
    "bytes" BIGINT NOT NULL,
    "userId" INTEGER NOT NULL,
    "purpose" "CourseMediaPurpose" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "UserProfileMedia_pkey" PRIMARY KEY ("userProfileMediaId")
);

-- CreateTable
CREATE TABLE "UnitMedia" (
    "unitMediaId" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "extension" TEXT NOT NULL,
    "state" "MediaState" NOT NULL,
    "bytes" BIGINT NOT NULL,
    "userId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "purpose" "UnitMediaPurpose" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "UnitMedia_pkey" PRIMARY KEY ("unitMediaId")
);

-- CreateTable
CREATE TABLE "LessonMedia" (
    "lessonMediaId" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "extension" TEXT NOT NULL,
    "state" "MediaState" NOT NULL,
    "bytes" BIGINT NOT NULL,
    "userId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "purpose" "LessonMediaPurpose" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "LessonMedia_pkey" PRIMARY KEY ("lessonMediaId")
);

-- CreateTable
CREATE TABLE "QuizMedia" (
    "quizMediaId" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "extension" TEXT NOT NULL,
    "state" "MediaState" NOT NULL,
    "bytes" BIGINT NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "purpose" "QuizMediaPurpose" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "QuizMedia_pkey" PRIMARY KEY ("quizMediaId")
);

-- CreateTable
CREATE TABLE "QuizSubmissionMedia" (
    "quizSubmissionMediaId" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "extension" TEXT NOT NULL,
    "state" "MediaState" NOT NULL,
    "bytes" BIGINT NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizSubmissionId" INTEGER NOT NULL,
    "purpose" "QuizSubmissionMediaPurpose" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "QuizSubmissionMedia_pkey" PRIMARY KEY ("quizSubmissionMediaId")
);

-- AddForeignKey
ALTER TABLE "UserProfileMedia" ADD CONSTRAINT "UserProfileMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMedia" ADD CONSTRAINT "CourseMedia_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitMedia" ADD CONSTRAINT "UnitMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitMedia" ADD CONSTRAINT "UnitMedia_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("unitId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonMedia" ADD CONSTRAINT "LessonMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonMedia" ADD CONSTRAINT "LessonMedia_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("lessonId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizMedia" ADD CONSTRAINT "QuizMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizMedia" ADD CONSTRAINT "QuizMedia_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSubmissionMedia" ADD CONSTRAINT "QuizSubmissionMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSubmissionMedia" ADD CONSTRAINT "QuizSubmissionMedia_quizSubmissionId_fkey" FOREIGN KEY ("quizSubmissionId") REFERENCES "QuizSubmission"("quizSubmissionId") ON DELETE RESTRICT ON UPDATE CASCADE;
