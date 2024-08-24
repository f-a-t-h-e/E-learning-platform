/*
  Warnings:

  - Added the required column `courseId` to the `QuizSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizSubmission" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;
