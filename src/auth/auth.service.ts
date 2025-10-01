import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { registerSchema } from 'src/schema/auth.schema';
import z from 'zod';
import axios from 'axios';

const REDIRECT_URI = process.env.clientUri
const API_ENDPOINT = 'https://discord.com/api/v10'
const CLIENT_SECRET = process.env.discordClientSecret
const CLIENT_ID = process.env.discordClientId

@Injectable()
export class AuthService {
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
    if(!code) throw new UnauthorizedException()
      console.log(REDIRECT_URI, API_ENDPOINT, CLIENT_ID, CLIENT_SECRET)
    // const data = new URLSearchParams({
    //   grant_type: 'authorization_code',
    //   code: code,
    //   redirect_uri: REDIRECT_URI!,
    //   client_id: CLIENT_ID!,
    //   client_secret: CLIENT_SECRET!
    // });

    // const headers = {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // };

    // const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
    //   method: 'POST',
    //   headers: headers,
    //   body: data.toString()
    // });

    // if (!response.ok) {
    //   const errorBody = await response.text();
    //   throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    // }
    // console.log(response)
    // return response.data;
  }

  findAll() {
    return `This action returns all auth`;
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
