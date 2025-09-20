import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("cats")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(":data")
  getHello(@Param() params: { data: string}): string {
    return this.appService.getHello(params.data);
  }
}
