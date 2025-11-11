/*
  Warnings:

  - You are about to drop the column `cooldownMs` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastCooldownUpdate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cooldownMs",
DROP COLUMN "lastCooldownUpdate",
ADD COLUMN     "cooldownUntil" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
