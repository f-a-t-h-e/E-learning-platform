/*
  Warnings:

  - You are about to drop the column `courseId` on the `QuizAnswer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuizAnswer" DROP CONSTRAINT "QuizAnswer_courseId_fkey";

-- AlterTable
ALTER TABLE "QuizAnswer" DROP COLUMN "courseId";
