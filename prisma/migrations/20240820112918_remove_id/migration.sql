/*
  Warnings:

  - The primary key for the `CourseEnrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseEnrollmentId` on the `CourseEnrollment` table. All the data in the column will be lost.
  - The primary key for the `CourseInstructor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseInstructorId` on the `CourseInstructor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_pkey",
DROP COLUMN "courseEnrollmentId",
ADD CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("courseId", "studentId");

-- AlterTable
ALTER TABLE "CourseInstructor" DROP CONSTRAINT "CourseInstructor_pkey",
DROP COLUMN "courseInstructorId",
ADD CONSTRAINT "CourseInstructor_pkey" PRIMARY KEY ("courseId", "instructorId");
