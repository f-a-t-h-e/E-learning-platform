/*
  Warnings:

  - The primary key for the `CourseEnrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CourseEnrollment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,courseId]` on the table `CourseEnrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_studentId_courseId_key" ON "CourseEnrollment"("studentId", "courseId");
