import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GuildService } from './guild.service';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';

@Controller('api/v1/guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Post('/create/:id')
  createGuild(@Param('id') id: string, @Body() createGuildDto: CreateGuildDto) {
    return this.guildService.createGuild(id, createGuildDto);
  }

  @Get('/:id')
  guildByUserId(@Param('id') id: string) {
    return this.guildService.getGuildByUserId(id);
  }
}
