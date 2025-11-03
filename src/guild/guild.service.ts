import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGuildDto } from './dto/create-guild.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async createGuild(userId: string, createGuildDto: CreateGuildDto) {
    // check if guild name is already taken
    const existing = await this.prisma.guild.findUnique({
      where: { name: createGuildDto.guildName },
    });

    if (existing) throw new BadRequestException('Guild name already exists.');

    // create guild and add creator as leader
    const newGuild = await this.prisma.guild.create({
      data: {
        name: createGuildDto.guildName,
        members: {
          create: {
            userId,
            role: 'LEADER',
          },
        },
      },
    });

    const guild = this.getGuildWithMembers(newGuild.id);

    return guild;
  }

  async getGuildWithMembers(guildId: number) {
    const guild = await this.prisma.guild.findUnique({
      where: { id: guildId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        members: {
          orderBy: {
            user: {
              totalPixelsPlaced: 'desc',
            },
          },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                totalPixelsPlaced: true,
              },
            },
            role: true,
          },
        },
      },
    });

    if (!guild) {
      throw new NotFoundException('Guild not found');
    }

    const members = guild.members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      totalPixelsPlaced: m.user.totalPixelsPlaced,
      role: m.role,
    }));

    // calculate total pixels of the guild
    const totalPixelsPlaced = members.reduce(
      (acc, member) => acc + member.totalPixelsPlaced,
      0,
    );

    return {
      id: guild.id,
      name: guild.name,
      description: guild.description,
      createdAt: guild.createdAt,
      totalPixelsPlaced,
      members,
    };
  }

  async getGuildByUserId(userId: string) {
    const membership = await this.prisma.userGuild.findFirst({
      where: { userId },
      select: { guildId: true },
    });

    if (!membership) {
      return; // returning empty instead of throwing an error to let client tanstack know that it is a success fetch and will stop refetching
    }

    return this.getGuildWithMembers(membership.guildId);
  }

  async getGuildInviteCode(guildId: number) {
    const newInviteCode = createId();

    await this.prisma.guild.update({
      where: { id: guildId },
      data: { inviteCode: newInviteCode },
    });
    return { inviteCode: newInviteCode };
  }

  async joinGuildByInvite(userId: string, inviteCode: string) {
    const guild = await this.prisma.guild.findUnique({
      where: { inviteCode },
    });

    if (!guild) throw new NotFoundException('Invalid invite code');

    // check if already joined
    const alreadyMember = await this.prisma.userGuild.findUnique({
      where: {
        userId_guildId: {
          userId,
          guildId: guild.id,
        },
      },
    });
    console.log(alreadyMember);

    if (alreadyMember) {
      throw new ConflictException('User has already joined a guild');
    }

    await this.prisma.userGuild.create({
      data: {
        userId,
        guildId: guild.id,
      },
    });

    return this.getGuildWithMembers(guild.id);
  }
}
