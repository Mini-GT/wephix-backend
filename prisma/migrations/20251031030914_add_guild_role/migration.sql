-- CreateEnum
CREATE TYPE "GuildRole" AS ENUM ('LEADER', 'MEMBER');

-- AlterTable
ALTER TABLE "UserGuild" ADD COLUMN     "role" "GuildRole" NOT NULL DEFAULT 'MEMBER';
