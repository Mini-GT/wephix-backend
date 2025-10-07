import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import prisma from 'src/prismaClient';
import { signJwt } from 'src/utils/jwt';
import { DiscordFields, User } from '@repo/types';

@Injectable()
export class AuthService {
  constructor(private config: ConfigService) {}

  async create(createAuthDto: CreateAuthDto) {
    // const result = await registerSchema.safeParseAsync(createAuthDto);
    // if (!result.success) {
    //   const flattened = z.flattenError(result.error)
    //   throw new BadRequestException(flattened.fieldErrors)
    // }
    // const { name, email, password } = result.data;
    // const existingUser = await prisma.user.findUnique({
    //   where: {
    //     email,
    //   }
    // })
    // if (existingUser) {
    //   return res.status(400).json({ message: "User already exists" });
    // }
    // const hashedPassword = await bcrypt.hash(password, 8)
    // const user = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //     role: "USER",
    //   }
    // })
    // if(!user) {
    //   res.status(500).json({ message: "Cannot create an account" })
    // }
    // res.status(201).json({ message: "User created" });
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
    let discordUser = await prisma.discord.findUnique({
      where: { discordId: id },
      include: { user: true },
    });

    // if discord user found with Discord ID, update user data
    if (discordUser) {
      discordUser = await prisma.discord.update({
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
    let user = await prisma.user.findUnique({ where: { email } });

    // if user found with same email, link discord to that user
    if (user) {
      await prisma.discord.create({
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
      user = await prisma.user.create({
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
