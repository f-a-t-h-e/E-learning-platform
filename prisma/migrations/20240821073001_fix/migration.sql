/*
  Warnings:

  - You are about to drop the column `quizFullGrade` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `quizPassGrade` on the `CourseEnrollment` table. All the data in the column will be lost.
  - Added the required column `quizGrade` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseEnrollment" DROP COLUMN "quizFullGrade",
DROP COLUMN "quizPassGrade",
ADD COLUMN     "quizGrade" INTEGER NOT NULL;
