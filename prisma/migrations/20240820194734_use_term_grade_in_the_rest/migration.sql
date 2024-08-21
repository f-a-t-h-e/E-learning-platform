/*
  Warnings:

  - You are about to drop the column `mark` on the `QuizAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `mark` on the `QuizQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `mark` on the `QuizSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizAnswer" DROP COLUMN "mark",
ADD COLUMN     "grade" SMALLINT;

-- AlterTable
ALTER TABLE "QuizQuestionOption" DROP COLUMN "mark",
ADD COLUMN     "grade" SMALLINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuizSubmission" DROP COLUMN "mark",
ADD COLUMN     "grade" SMALLINT;
