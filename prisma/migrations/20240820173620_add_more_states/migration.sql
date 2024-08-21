-- CreateEnum
CREATE TYPE "UnitState" AS ENUM ('created', 'avaialble', 'calculatingQuizzesMarks');

-- CreateEnum
CREATE TYPE "LessonState" AS ENUM ('created', 'avaialble', 'calculatingQuizzesMarks');

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "state" SET DEFAULT 'created';

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "state" "LessonState" NOT NULL DEFAULT 'created';

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "state" "UnitState" NOT NULL DEFAULT 'created';
