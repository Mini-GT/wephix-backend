/*
  Warnings:

  - You are about to drop the column `factionId` on the `Pixel` table. All the data in the column will be lost.
  - You are about to drop the `Faction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Pixel" DROP CONSTRAINT "Pixel_factionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserFaction" DROP CONSTRAINT "UserFaction_factionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserFaction" DROP CONSTRAINT "UserFaction_userId_fkey";

-- AlterTable
ALTER TABLE "Pixel" DROP COLUMN "factionId",
ADD COLUMN     "guildId" INTEGER;

-- DropTable
DROP TABLE "public"."Faction";

-- DropTable
DROP TABLE "public"."UserFaction";

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGuild" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGuild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_name_key" ON "Guild"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserGuild_userId_guildId_key" ON "UserGuild"("userId", "guildId");

-- AddForeignKey
ALTER TABLE "UserGuild" ADD CONSTRAINT "UserGuild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGuild" ADD CONSTRAINT "UserGuild_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pixel" ADD CONSTRAINT "Pixel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE SET NULL ON UPDATE CASCADE;
