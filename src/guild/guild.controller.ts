import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

  @Get('/invite/:id')
  getGuildInviteCode(@Param('id') id: string) {
    return this.guildService.getGuildInviteCode(+id);
  }

  @Post('/join/:id/:code')
  joinGuildByInvite(@Param('id') id: string, @Param('code') code: string) {
    return this.guildService.joinGuildByInvite(id, code);
  }

  @Delete('/leave/:id')
  leaveGuild(@Param('id') id: string, @Query('guildId') guildId: string) {
    return this.guildService.leaveGuild(id, +guildId);
  }

  @Delete('/kick')
  kickGuildMember(
    @Query('leaderId') leaderId: string,
    @Query('memberId') memberId: string,
    @Query('guildId') guildId: string,
  ) {
    return this.guildService.kickGuildMember(leaderId, memberId, +guildId);
  }
}
