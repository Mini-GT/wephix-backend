import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto) {
    const { userId, ...rest } = createReportDto;

    // get reports from the last 24 hours
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    let user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const reportsCount = await this.prisma.reports.count({
      where: {
        userId,
        createdAt: { gte: since },
      },
    });

    if (reportsCount >= 5) {
      throw new BadRequestException(
        'You can only submit up to 5 reports every 24 hours.',
      );
    }

    await this.prisma.reports.create({
      data: {
        ...rest,
        userId,
      },
    });

    return 'success';
  }

  async findAll(page: number) {
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const [reports, totalReports] = await Promise.all([
      this.prisma.reports.findMany({
        select: {
          id: true,
          category: true,
          message: true,
          subject: true,
          createdAt: true,
          user: { select: { name: true } },
        },
        take: pageSize,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reports.count(),
    ]);

    const totalPages = Math.ceil(totalReports / pageSize);

    return { reports, hasMore: page < totalPages };
  }
}
