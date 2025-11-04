/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - The required column `inviteCode` was added to the `Guild` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "inviteCode" TEXT NOT NULL,
ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Guild_inviteCode_key" ON "Guild"("inviteCode");
