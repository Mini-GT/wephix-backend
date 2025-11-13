import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { endOfDay, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const today = startOfDay(new Date());
    const startWeek = startOfWeek(today, { weekStartsOn: 1 });
    const startMonth = startOfMonth(today);

    const allTime = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        totalPixelsPlaced: true,
        profileImage: true,
        discord: {
          select: {
            discordId: true,
            global_name: true,
            username: true,
            avatar: true,
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
        profileImage: true,
        discord: {
          select: {
            discordId: true,
            username: true,
            global_name: true,
            avatar: true,
          },
        },
      },
    });

    const dailyLeaderboard = daily.map((d) => {
      const user = dailyWithUser.find((u) => u.id === d.userId);
      return {
        id: user?.id,
        name: user?.name,
        profileImage: user?.profileImage,
        discord: {
          discordId: user?.discord?.discordId,
          username: user?.discord?.username,
          globalName: user?.discord?.global_name,
          avatar: user?.discord?.avatar,
        },
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
        profileImage: true,
        discord: {
          select: {
            discordId: true,
            username: true,
            global_name: true,
            avatar: true,
          },
        },
      },
    });

    const weeklyLeaderboard = weekly.map((w) => {
      const user = weeklyWithUser.find((u) => u.id === w.userId);
      return {
        id: user?.id,
        name: user?.name,
        profileImage: user?.profileImage,
        discord: {
          discordId: user?.discord?.discordId,
          username: user?.discord?.username,
          globalName: user?.discord?.global_name,
          avatar: user?.discord?.avatar,
        },
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
        profileImage: true,
        discord: {
          select: {
            discordId: true,
            username: true,
            global_name: true,
            avatar: true,
          },
        },
      },
    });

    const monthlyLeaderboard = monthly.map((m) => {
      const user = monthlyWithUser.find((u) => u.id === m.userId);
      return {
        id: user?.id,
        name: user?.name,
        profileImage: user?.profileImage,
        discord: {
          discordId: user?.discord?.discordId,
          username: user?.discord?.username,
          globalName: user?.discord?.global_name,
          avatar: user?.discord?.avatar,
        },
        totalPixelsPlaced: m._sum.count ?? 0,
      };
    });

    const users = {
      allTime: allTime.map((u) => ({
        id: u.id,
        name: u.name,
        profileImage: u.profileImage,
        discord: {
          discordId: u.discord?.discordId,
          username: u.discord?.username,
          globalName: u.discord?.global_name,
          avatar: u.discord?.avatar,
        },
        totalPixelsPlaced: u.totalPixelsPlaced,
      })),
      daily: dailyLeaderboard,
      weekly: weeklyLeaderboard,
      monthly: monthlyLeaderboard,
    };

    if (!users.allTime.length) {
      throw new NotFoundException('No users found');
    }

    return { ...users };
  }
}
