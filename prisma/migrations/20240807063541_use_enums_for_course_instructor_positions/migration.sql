/*
  Warnings:

  - Changed the type of `position` on the `CourseInstructor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CourseInstructorPositions" AS ENUM ('OWNER', 'TEACHER');

-- AlterTable
ALTER TABLE "CourseInstructor" DROP COLUMN "position",
ADD COLUMN     "position" "CourseInstructorPositions" NOT NULL;
