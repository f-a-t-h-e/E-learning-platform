-- CreateEnum
CREATE TYPE "EmailVerifiedState" AS ENUM ('pending', 'verified');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" "EmailVerifiedState" NOT NULL DEFAULT 'pending';
