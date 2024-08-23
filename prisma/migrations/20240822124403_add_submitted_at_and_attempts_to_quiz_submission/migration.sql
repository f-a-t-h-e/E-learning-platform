-- AlterTable
ALTER TABLE "QuizSubmission" ADD COLUMN     "attempts" SMALLINT,
ADD COLUMN     "submittedAt" TIMESTAMPTZ(3);
