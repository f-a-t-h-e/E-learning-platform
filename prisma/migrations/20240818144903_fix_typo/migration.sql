/*
  Warnings:

  - You are about to drop the `QuizeQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizeQuestionOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuizAnswer" DROP CONSTRAINT "QuizAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuizeQuestion" DROP CONSTRAINT "QuizeQuestion_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizeQuestionOption" DROP CONSTRAINT "QuizeQuestionOption_questionId_fkey";

-- DropTable
DROP TABLE "QuizeQuestion";

-- DropTable
DROP TABLE "QuizeQuestionOption";

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "fullMark" SMALLINT NOT NULL DEFAULT 0,
    "passMark" SMALLINT NOT NULL DEFAULT 0,
    "correctAnswer" TEXT,
    "questionType" "QuestionType" NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestionOption" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "optionText" TEXT NOT NULL,
    "mark" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "QuizQuestionOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestionOption" ADD CONSTRAINT "QuizQuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
