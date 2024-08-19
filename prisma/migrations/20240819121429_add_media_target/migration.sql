/*
  Warnings:

  - Added the required column `target` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaTarget" AS ENUM ('PROFILE_PICTURE', 'PROFILE_BANNER', 'COURSE_BANNER', 'COURSE_MATERIAL', 'UNIT_BANNER', 'UNIT_MATERIAL', 'LESSON_BANNER', 'LESSON_MATERIAL');

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "target" "MediaTarget" NOT NULL;
