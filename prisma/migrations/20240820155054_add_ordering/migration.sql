/*
  Warnings:

  - Added the required column `order` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "order" SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "order" SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "order" SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "order" SMALLINT NOT NULL;
