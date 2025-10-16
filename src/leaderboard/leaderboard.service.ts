import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  create(createLeaderboardDto: CreateLeaderboardDto) {
    return 'This action adds a new leaderboard';
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        totalPixelsPlaced: true,
        discord: {
          select: {
            global_name: true,
            username: true,
          },
        },
      },
      orderBy: {
        totalPixelsPlaced: 'desc',
      },
    });

    if (!users) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaderboard`;
  }

  update(id: number, updateLeaderboardDto: UpdateLeaderboardDto) {
    return `This action updates a #${id} leaderboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaderboard`;
  }
}
