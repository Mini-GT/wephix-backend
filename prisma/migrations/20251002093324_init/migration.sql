-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'DEMO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('verified', 'unverified', 'banned', 'pending', 'suspended');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "discordId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'unverified',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "name" TEXT,
    "password" TEXT,
    "profileImage" TEXT,
    "emailVerifyToken" TEXT,
    "emailVerifyTokenExpiry" TIMESTAMP(3),
    "forgotPassTokenExpiry" TIMESTAMP(3),
    "forgotPassVerifyToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
