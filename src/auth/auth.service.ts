import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { signJwt } from '../utils/jwt';
import { DiscordFields, User } from '@repo/types';
import bcrypt from 'bcryptjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    if (createAuthDto.password !== createAuthDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const { name, email, password } = createAuthDto;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    if (!user) {
      throw new BadRequestException('Could not create an account');
    }

    return 'User registered';
  }

  async login(loginAuthDto: LoginAuthDto) {
    const JWTSECRET = this.config.get('jwtsecretKey');

    const user = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.email },
    });

    if (!user || !user.password) {
      throw new BadRequestException('Incorrect email or password');
    }

    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Incorrect email or password');
    }

    const token = signJwt({ id: user.id }, JWTSECRET, {
      expiresIn: '7d',
    });

    return { token };
  }

  async oauth2(code: string) {
    const REDIRECT_URI = this.config.get('clientUri');
    const CLIENT_ID = this.config.get('discordClientId');
    const CLIENT_SECRET = this.config.get('discordClientSecret');
    const API_ENDPOINT = 'https://discord.com/api/v10';
    const JWTSECRET = this.config.get('jwtsecretKey');

    if (!code) throw new UnauthorizedException('Missing code');
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const response = await axios.post(`${API_ENDPOINT}/oauth2/token`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;
    if (!accessToken) {
      throw new UnauthorizedException('No access token from Discord');
    }

    // get user info
    const userInfo = await axios.get(`${API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { id, username, avatar, global_name, email } =
      userInfo.data as DiscordFields & User;

    // find a user with the Discord ID
    let discordUser = await this.prisma.discord.findUnique({
      where: { discordId: id },
      include: { user: true },
    });

    // if discord user found with Discord ID, update user data
    if (discordUser) {
      discordUser = await this.prisma.discord.update({
        where: { discordId: id },
        data: {
          username,
          global_name,
          avatar,
          user: {
            update: { updatedAt: new Date() },
          },
        },
        include: { user: true },
      });

      const token = signJwt({ id: discordUser.user.id }, JWTSECRET, {
        expiresIn: '7d',
      });

      return { token };
    }

    // if no discord user, find user with the same email
    let user = await this.prisma.user.findUnique({ where: { email } });

    // if user found with same email, link discord to that user
    if (user) {
      await this.prisma.discord.create({
        data: {
          discordId: id,
          username,
          global_name,
          avatar,
          user: { connect: { id: user.id } },
        },
      });
    } else {
      // if no user found with same email, create a new user and link discord
      user = await this.prisma.user.create({
        data: {
          email,
          name: global_name ?? 'Discord User',
          role: 'USER',
          discord: {
            create: {
              discordId: id,
              username,
              global_name,
              avatar,
            },
          },
        },
      });
    }

    const token = signJwt({ id: user.id }, JWTSECRET, { expiresIn: '7d' });
    return { token };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
