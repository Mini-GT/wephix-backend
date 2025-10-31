import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';
import { PrismaService } from '../prisma/prisma.service';

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

  findAll() {
    return `This action returns all guild`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guild`;
  }

  update(id: number, updateGuildDto: UpdateGuildDto) {
    return `This action updates a #${id} guild`;
  }

  remove(id: number) {
    return `This action removes a #${id} guild`;
  }
}
