/*
  Warnings:

  - The values [calculatingQuizzesMarks] on the enum `CourseState` will be removed. If these variants are still used in the database, this will fail.
  - The values [calculatingQuizzesMarks] on the enum `LessonState` will be removed. If these variants are still used in the database, this will fail.
  - The values [calculatingQuizzesMarks] on the enum `QuizState` will be removed. If these variants are still used in the database, this will fail.
  - The values [calculatingQuizzesMarks] on the enum `UnitState` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `attendanceMark` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `quizzesMark` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `attendanceMark` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `quizzesMark` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `attendanceMark` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `quizzesMark` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `fullMark` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `passMark` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `fullMark` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `passMark` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `attendanceMark` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `quizzesMark` on the `Unit` table. All the data in the column will be lost.
  - Added the required column `quizFullGrade` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CourseState_new" AS ENUM ('created', 'avaialble', 'calculatingQuizGrade');
ALTER TABLE "Course" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "state" TYPE "CourseState_new" USING ("state"::text::"CourseState_new");
ALTER TYPE "CourseState" RENAME TO "CourseState_old";
ALTER TYPE "CourseState_new" RENAME TO "CourseState";
DROP TYPE "CourseState_old";
ALTER TABLE "Course" ALTER COLUMN "state" SET DEFAULT 'created';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LessonState_new" AS ENUM ('created', 'avaialble', 'calculatingQuizGrade');
ALTER TABLE "Lesson" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Lesson" ALTER COLUMN "state" TYPE "LessonState_new" USING ("state"::text::"LessonState_new");
ALTER TYPE "LessonState" RENAME TO "LessonState_old";
ALTER TYPE "LessonState_new" RENAME TO "LessonState";
DROP TYPE "LessonState_old";
ALTER TABLE "Lesson" ALTER COLUMN "state" SET DEFAULT 'created';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "QuizState_new" AS ENUM ('created', 'avaialble', 'calculatingQuizGrade');
ALTER TABLE "Quiz" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Quiz" ALTER COLUMN "state" TYPE "QuizState_new" USING ("state"::text::"QuizState_new");
ALTER TYPE "QuizState" RENAME TO "QuizState_old";
ALTER TYPE "QuizState_new" RENAME TO "QuizState";
DROP TYPE "QuizState_old";
ALTER TABLE "Quiz" ALTER COLUMN "state" SET DEFAULT 'created';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UnitState_new" AS ENUM ('created', 'avaialble', 'calculatingQuizGrade');
ALTER TABLE "Unit" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Unit" ALTER COLUMN "state" TYPE "UnitState_new" USING ("state"::text::"UnitState_new");
ALTER TYPE "UnitState" RENAME TO "UnitState_old";
ALTER TYPE "UnitState_new" RENAME TO "UnitState";
DROP TYPE "UnitState_old";
ALTER TABLE "Unit" ALTER COLUMN "state" SET DEFAULT 'created';
COMMIT;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "attendanceMark",
DROP COLUMN "quizzesMark",
ADD COLUMN     "quizFullGrade" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quizPassGrade" INTEGER;

-- AlterTable
ALTER TABLE "CourseEnrollment" DROP COLUMN "attendanceMark",
DROP COLUMN "quizzesMark",
ADD COLUMN     "quizFullGrade" INTEGER NOT NULL,
ADD COLUMN     "quizPassGrade" INTEGER;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "attendanceMark",
DROP COLUMN "quizzesMark",
ADD COLUMN     "quizFullGrade" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "quizPassGrade" SMALLINT;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "fullMark",
DROP COLUMN "passMark",
ADD COLUMN     "fullGrade" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "passGrade" SMALLINT DEFAULT 0;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "fullMark",
DROP COLUMN "passMark",
ADD COLUMN     "fullGrade" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "passGrade" SMALLINT DEFAULT 0;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "attendanceMark",
DROP COLUMN "quizzesMark",
ADD COLUMN     "quizFullGrade" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quizPassGrade" INTEGER;
