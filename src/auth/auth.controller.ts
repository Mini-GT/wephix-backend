import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private config: ConfigService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get('discord')
  @Redirect('http://localhost:5000')
  async oauth2(@Res({ passthrough: true }) res: Response, @Query('code') code: string) {
    const NODE_ENV = this.config.get('NODE_ENV')
    const { token, userData } = await this.authService.oauth2(code)
    res.cookie("token", token, {
      httpOnly: false,
      secure: NODE_ENV,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return { userData }
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
