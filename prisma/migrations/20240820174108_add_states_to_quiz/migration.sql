-- CreateEnum
CREATE TYPE "QuizState" AS ENUM ('created', 'avaialble', 'calculatingQuizzesMarks');

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "state" "QuizState" NOT NULL DEFAULT 'created';
