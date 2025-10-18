import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { PrismaService } from '../prisma/prisma.service';
import { endOfDay, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  create(createLeaderboardDto: CreateLeaderboardDto) {
    return 'This action adds a new leaderboard';
  }

  async findAll() {
    const today = startOfDay(new Date());
    const startWeek = startOfWeek(today, { weekStartsOn: 1 });
    const startMonth = startOfMonth(today);

    const allTime = await this.prisma.user.findMany({
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
      take: 20,
    });

    // ---- daily ----
    const daily = await this.prisma.pixelStats.groupBy({
      by: ['userId'],
      where: {
        date: {
          gte: startOfDay(today),
          lt: endOfDay(today),
        },
      },
      _sum: { count: true },
      orderBy: { _sum: { count: 'desc' } },
      take: 20,
    });

    const dailyWithUser = await this.prisma.user.findMany({
      where: {
        id: { in: daily.map((d) => d.userId) },
      },
      select: {
        id: true,
        name: true,
        discord: {
          select: {
            username: true,
            global_name: true,
          },
        },
      },
    });

    const dailyLeaderboard = daily.map((d) => {
      const user = dailyWithUser.find((u) => u.id === d.userId);
      return {
        id: user?.id,
        name: user?.name,
        username: user?.discord?.username,
        globalName: user?.discord?.global_name,
        totalPixelsPlaced: d._sum.count ?? 0,
      };
    });

    // ---- weekly ----
    const weekly = await this.prisma.pixelStats.groupBy({
      by: ['userId'],
      where: { date: { gte: startWeek } },
      _sum: { count: true },
      orderBy: { _sum: { count: 'desc' } },
      take: 20,
    });

    const weeklyWithUser = await this.prisma.user.findMany({
      where: {
        id: { in: weekly.map((w) => w.userId) },
      },
      select: {
        id: true,
        name: true,
        discord: {
          select: {
            username: true,
            global_name: true,
          },
        },
      },
    });

    const weeklyLeaderboard = weekly.map((w) => {
      const user = weeklyWithUser.find((u) => u.id === w.userId);
      return {
        id: user?.id,
        name: user?.name,
        username: user?.discord?.username,
        globalName: user?.discord?.global_name,
        totalPixelsPlaced: w._sum.count ?? 0,
      };
    });

    // ---- monthly ----
    const monthly = await this.prisma.pixelStats.groupBy({
      by: ['userId'],
      where: { date: { gte: startMonth } },
      _sum: { count: true },
      orderBy: { _sum: { count: 'desc' } },
      take: 20,
    });

    const monthlyWithUser = await this.prisma.user.findMany({
      where: {
        id: { in: monthly.map((m) => m.userId) },
      },
      select: {
        id: true,
        name: true,
        discord: {
          select: {
            username: true,
            global_name: true,
          },
        },
      },
    });

    const monthlyLeaderboard = monthly.map((m) => {
      const user = monthlyWithUser.find((u) => u.id === m.userId);
      return {
        id: user?.id,
        name: user?.name,
        username: user?.discord?.username,
        globalName: user?.discord?.global_name,
        totalPixelsPlaced: m._sum.count ?? 0,
      };
    });

    const users = {
      allTime: allTime.map((u) => ({
        id: u.id,
        name: u.name,
        discord: {
          username: u.discord?.username,
          globalName: u.discord?.global_name,
        },
        totalPixelsPlaced: u.totalPixelsPlaced,
      })),
      daily: dailyLeaderboard,
      weekly: weeklyLeaderboard,
      monthly: monthlyLeaderboard,
    };

    if (!users) {
      throw new NotFoundException('No users found');
    }

    return { ...users };
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
