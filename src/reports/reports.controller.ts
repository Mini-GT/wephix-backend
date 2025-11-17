import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { type AuthenticatedRequest } from 'src/types/express';

@Controller('api/v1/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.create(req.userId, createReportDto);
  }

  @Get()
  findAll(@Query('page') page: string) {
    return this.reportsService.findAll(+page);
  }
}
