/*
  Warnings:

  - You are about to drop the column `cooldownUntil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastPaintUsedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cooldownUntil",
DROP COLUMN "lastPaintUsedAt",
ADD COLUMN     "cooldownMs" INTEGER NOT NULL DEFAULT 0;
