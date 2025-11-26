import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    console.log('Called every 5 seconds');
  }
}
