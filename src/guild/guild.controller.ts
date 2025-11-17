import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { GuildService } from './guild.service';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';
import { TransferLeadershipDto } from './dto/transfer-leadership-guild.dto';
import { type AuthenticatedRequest } from '../types/express';

@Controller('api/v1/guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Post('/create')
  createGuild(
    @Req() req: AuthenticatedRequest,
    @Body() createGuildDto: CreateGuildDto,
  ) {
    return this.guildService.createGuild(req.userId, createGuildDto);
  }

  @Get('/')
  guildByUserId(@Req() req: AuthenticatedRequest) {
    return this.guildService.getGuildByUserId(req.userId);
  }

  @Get('/invite/:id')
  getGuildInviteCode(@Param('id') id: string) {
    return this.guildService.getGuildInviteCode(+id);
  }

  @Post('/join/:code')
  joinGuildByInvite(
    @Req() req: AuthenticatedRequest,
    @Param('code') code: string,
  ) {
    return this.guildService.joinGuildByInvite(req.userId, code);
  }

  @Delete('/leave')
  leaveGuild(
    @Req() req: AuthenticatedRequest,
    @Query('guildId') guildId: string,
  ) {
    return this.guildService.leaveGuild(req.userId, +guildId);
  }

  @Delete('/kick')
  kickGuildMember(
    @Req() req: AuthenticatedRequest,
    @Query('memberId') memberId: string,
    @Query('guildId') guildId: string,
  ) {
    const leaderId = req.userId;
    return this.guildService.kickGuildMember(leaderId, memberId, +guildId);
  }

  @Patch('/transfer/leadership')
  transferLeadership(
    @Req() req: AuthenticatedRequest,
    @Body() transferLeadershipDto: TransferLeadershipDto,
  ) {
    const leaderId = req.userId;
    return this.guildService.transferLeadership(
      leaderId,
      transferLeadershipDto,
    );
  }

  @Patch('/description')
  updateGuildDescription(
    @Req() req: AuthenticatedRequest,
    @Body() updateGuildDto: UpdateGuildDto,
  ) {
    const leaderId = req.userId;
    return this.guildService.updateGuildDescription(leaderId, updateGuildDto);
  }
}
