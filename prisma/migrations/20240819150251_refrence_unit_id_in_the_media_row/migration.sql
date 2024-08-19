-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "unitId" INTEGER;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
