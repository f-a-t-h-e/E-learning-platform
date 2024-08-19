/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_username_key" ON "UserProfile"("username");
