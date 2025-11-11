-- AlterTable
ALTER TABLE "User" ALTER COLUMN "cooldownUntil" DROP NOT NULL,
ALTER COLUMN "cooldownUntil" DROP DEFAULT;
