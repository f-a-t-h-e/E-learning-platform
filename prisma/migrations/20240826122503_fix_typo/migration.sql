-- AlterTable
ALTER TABLE "CourseEnrollment" ALTER COLUMN "endsAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "CourseInstructor" ALTER COLUMN "endsAt" SET DATA TYPE TIMESTAMPTZ(3);
