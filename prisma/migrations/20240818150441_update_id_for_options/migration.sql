/*
  Warnings:

  - The primary key for the `QuizQuestionOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `QuizQuestionOption` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "QuizQuestionOption" DROP CONSTRAINT "QuizQuestionOption_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE SMALLINT,
ADD CONSTRAINT "QuizQuestionOption_pkey" PRIMARY KEY ("id", "questionId");
DROP SEQUENCE "QuizQuestionOption_id_seq";
