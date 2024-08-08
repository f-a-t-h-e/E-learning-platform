/*
  Warnings:

  - You are about to drop the column `userId` on the `ForumPost` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ForumComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forumId` to the `ForumPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ForumPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `writerId` to the `ForumPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('URL', 'TEXT');

-- CreateEnum
CREATE TYPE "ForumPositions" AS ENUM ('OWNER', 'TEACHER', 'STUDENT');

-- DropForeignKey
ALTER TABLE "ForumPost" DROP CONSTRAINT "ForumPost_userId_fkey";

-- AlterTable
ALTER TABLE "ForumComment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ForumPost" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "forumId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "writerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "LessonContent" (
    "id" INTEGER NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "LessonContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forum" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" INTEGER NOT NULL,
    "courseId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Forum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumMember" (
    "forumId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "position" "ForumPositions" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumMember_pkey" PRIMARY KEY ("forumId","memberId")
);

-- AddForeignKey
ALTER TABLE "LessonContent" ADD CONSTRAINT "LessonContent_id_fkey" FOREIGN KEY ("id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum" ADD CONSTRAINT "Forum_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum" ADD CONSTRAINT "Forum_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumMember" ADD CONSTRAINT "ForumMember_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "Forum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumMember" ADD CONSTRAINT "ForumMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "Forum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
