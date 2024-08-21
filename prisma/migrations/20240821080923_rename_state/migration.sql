/*
  Warnings:

  - The values [calculatingQuizGrade] on the enum `CourseState` will be removed. If these variants are still used in the database, this will fail.
  - The values [calculatingQuizGrade] on the enum `LessonState` will be removed. If these variants are still used in the database, this will fail.
  - The values [calculatingQuizGrade] on the enum `QuizState` will be removed. If these variants are still used in the database, this will fail.
  - The values [calculatingQuizGrade] on the enum `UnitState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CourseState_new" AS ENUM ('created', 'avaialble', 'calculatedGrades');
ALTER TABLE "Course" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "state" TYPE "CourseState_new" USING ("state"::text::"CourseState_new");
ALTER TYPE "CourseState" RENAME TO "CourseState_old";
ALTER TYPE "CourseState_new" RENAME TO "CourseState";
DROP TYPE "CourseState_old";
ALTER TABLE "Course" ALTER COLUMN "state" SET DEFAULT 'created';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LessonState_new" AS ENUM ('created', 'avaialble', 'calculatedGrades');
ALTER TABLE "Lesson" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Lesson" ALTER COLUMN "state" TYPE "LessonState_new" USING ("state"::text::"LessonState_new");
ALTER TYPE "LessonState" RENAME TO "LessonState_old";
ALTER TYPE "LessonState_new" RENAME TO "LessonState";
DROP TYPE "LessonState_old";
ALTER TABLE "Lesson" ALTER COLUMN "state" SET DEFAULT 'created';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "QuizState_new" AS ENUM ('created', 'avaialble', 'calculatedGrades');
ALTER TABLE "Quiz" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Quiz" ALTER COLUMN "state" TYPE "QuizState_new" USING ("state"::text::"QuizState_new");
ALTER TYPE "QuizState" RENAME TO "QuizState_old";
ALTER TYPE "QuizState_new" RENAME TO "QuizState";
DROP TYPE "QuizState_old";
ALTER TABLE "Quiz" ALTER COLUMN "state" SET DEFAULT 'created';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UnitState_new" AS ENUM ('created', 'avaialble', 'calculatedGrades');
ALTER TABLE "Unit" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Unit" ALTER COLUMN "state" TYPE "UnitState_new" USING ("state"::text::"UnitState_new");
ALTER TYPE "UnitState" RENAME TO "UnitState_old";
ALTER TYPE "UnitState_new" RENAME TO "UnitState";
DROP TYPE "UnitState_old";
ALTER TABLE "Unit" ALTER COLUMN "state" SET DEFAULT 'created';
COMMIT;
