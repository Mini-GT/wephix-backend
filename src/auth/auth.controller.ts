import {
  Controller,
  Get,
  Post,
  Body,
  Redirect,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { type Response } from 'express';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginAuthDto: LoginAuthDto,
  ) {
    const NODE_ENV = this.config.get('NODE_ENV');

    const { token } = await this.authService.login(loginAuthDto);
    res.cookie('loginToken', token, {
      httpOnly: true,
      secure: NODE_ENV,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('hasLoginToken', true, {
      httpOnly: false,
      secure: NODE_ENV,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return 'Login successful';
  }

  @Get('discord')
  @Redirect('http://localhost:5000/login')
  async oauth2(
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Query('error') error: string,
  ) {
    // return to redirect user if they cancel the oauth
    if (error) {
      return;
    }

    const NODE_ENV = this.config.get('NODE_ENV');
    const { token } = await this.authService.oauth2(code);
    res.cookie('loginToken', token, {
      httpOnly: true,
      secure: NODE_ENV,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('hasLoginToken', true, {
      httpOnly: false,
      secure: NODE_ENV,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
