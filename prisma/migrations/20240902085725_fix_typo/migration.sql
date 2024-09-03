/*
  Warnings:

  - Changed the type of `purpose` on the `UserProfileMedia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "UserProfileMedia" DROP COLUMN "purpose",
ADD COLUMN     "purpose" "UserProfileMediaPurpose" NOT NULL;
