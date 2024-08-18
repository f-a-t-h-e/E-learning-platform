/*
  Warnings:

  - Added the required column `startsAt` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "endsAt" TIMESTAMPTZ(3),
ADD COLUMN     "lateSubmissionDate" TIMESTAMPTZ(3),
ADD COLUMN     "startsAt" TIMESTAMPTZ(3) NOT NULL;
