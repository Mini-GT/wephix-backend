import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import prisma from 'src/prismaClient';
import calculateCharges from 'src/utils/calculateCharges';
import { User } from '@repo/types';

@Injectable()
export class CanvasService {
  async create(createCanvasDto: CreateCanvasDto) {
    await prisma.canvas.create({
      data: {
        name: createCanvasDto.name.toUpperCase(),
        gridSize: parseInt(createCanvasDto.gridSize),
      },
    });

    return 'Canvas created successfully';
  }

  // async getMainCanvas() {
  //   return 'main canvas';
  // }

  async findOne(canvasId: number) {
    const canvas = await prisma.canvas.findUnique({
      where: { id: canvasId },
      select: {
        id: true,
        name: true,
        gridSize: true,
        pixels: {
          select: {
            x: true,
            y: true,
            color: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return { ...canvas };
  }

  async updateCanvasPixel(canvasId: number, updateCanvasDto: UpdateCanvasDto) {
    let user = await prisma.user.findUnique({
      where: { id: updateCanvasDto.userId },
      select: { id: true, charges: true, cooldownUntil: true },
    });

    if (!user) throw new NotFoundException('User not found');

    // get user charges and cooldown
    const { charges, cooldownUntil } = calculateCharges(user);
    if (charges <= 0) {
      throw new ForbiddenException('No charges left!');
    }

    const newCharges = charges - 1;
    const RECHARGE_TIME = 30 * 1000;
    const newCooldown =
      charges === 30 // if they spent from full
        ? new Date(Date.now() + RECHARGE_TIME)
        : cooldownUntil;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        charges: newCharges,
        cooldownUntil: newCooldown,
        totalPixelsPlaced: { increment: 1 },
      },
    });

    await prisma.pixel.upsert({
      where: {
        canvasId_x_y: {
          canvasId: canvasId,
          x: updateCanvasDto.x,
          y: updateCanvasDto.y,
        },
      },
      update: {
        color: updateCanvasDto.color,
        userId: updateCanvasDto.userId,
        x: updateCanvasDto.x,
        y: updateCanvasDto.y,
      },
      create: {
        canvasId,
        x: updateCanvasDto.x,
        y: updateCanvasDto.y,
        color: updateCanvasDto.color,
        userId: updateCanvasDto.userId,
      },
    });

    return 'Canvas updated successfully';
  }

  remove(id: number) {
    return `This action removes a #${id} canva`;
  }
}
