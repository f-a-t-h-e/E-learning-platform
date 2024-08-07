/*
  Warnings:

  - You are about to drop the column `category` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `CourseCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_category_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "category";

-- DropTable
DROP TABLE "CourseCategory";
