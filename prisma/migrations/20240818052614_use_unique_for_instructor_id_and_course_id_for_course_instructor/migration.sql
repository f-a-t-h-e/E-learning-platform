/*
  Warnings:

  - The primary key for the `CourseInstructor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CourseInstructor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[instructorId,courseId]` on the table `CourseInstructor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CourseInstructor" DROP CONSTRAINT "CourseInstructor_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "CourseInstructor_instructorId_courseId_key" ON "CourseInstructor"("instructorId", "courseId");
