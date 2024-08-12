/*
  Warnings:

  - Added the required column `extension` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaState" AS ENUM ('UPLOADING', 'FAILED', 'UPLOADED');

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "extension" TEXT NOT NULL,
ADD COLUMN     "state" "MediaState" NOT NULL;
