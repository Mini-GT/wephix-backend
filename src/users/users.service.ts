import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import calculateCharges from '../utils/calculateCharges';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getPaintCharges(id: string) {
    let userPaintCharges = await this.prisma.user.findUnique({
      where: { id },
      select: {
        charges: true,
        cooldownUntil: true,
      },
    });

    if (!userPaintCharges) {
      throw new NotFoundException('User not found');
    }

    const { charges, cooldownUntil } = calculateCharges({
      charges: userPaintCharges.charges,
      cooldownUntil: userPaintCharges.cooldownUntil,
    });

    if (
      charges !== userPaintCharges.charges ||
      cooldownUntil !== userPaintCharges.cooldownUntil
    ) {
      await this.prisma.user.update({
        where: { id },
        data: { charges, cooldownUntil },
      });

      userPaintCharges = { charges, cooldownUntil };
    }

    return { charges, cooldownUntil };
  }

  async getUserById(userId: string) {
    let user = await this.prisma.user.findUnique({
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

    return { ...user };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
