/*
  Warnings:

  - Made the column `lastCooldownUpdate` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastCooldownUpdate" SET NOT NULL,
ALTER COLUMN "lastCooldownUpdate" SET DEFAULT CURRENT_TIMESTAMP;
