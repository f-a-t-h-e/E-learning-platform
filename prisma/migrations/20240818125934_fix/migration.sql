-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_replyToMessageId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "replyToMessageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyToMessageId_fkey" FOREIGN KEY ("replyToMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
