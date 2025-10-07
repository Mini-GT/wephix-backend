import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import prisma from 'src/prismaClient';
import calculateCharges from 'src/utils/calculateCharges';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    // return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async getUserById(userId: string) {
    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        createdAt: true,
        email: true,
        name: true,
        profileImage: true,
        status: true,
        role: true,
        totalPixelsPlaced: true,
        charges: true,
        cooldownUntil: true,
        discord: {
          select: {
            discordId: true,
            username: true,
            global_name: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { charges, cooldownUntil } = calculateCharges({
      charges: user.charges,
      cooldownUntil: user.cooldownUntil,
    });

    if (charges !== user.charges || cooldownUntil !== user.cooldownUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { charges, cooldownUntil },
      });

      user = { ...user, charges, cooldownUntil };
    }

    return { ...user, charges, cooldownUntil };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
