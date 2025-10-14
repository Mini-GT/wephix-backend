import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import calculateCharges from '../utils/calculateCharges';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class CanvasService {
  constructor(
    private prisma: PrismaService,
    private socket: EventsGateway,
  ) {}

  // private canvas = new Map<string, PixelType>();

  // on server restart
  // onModuleInit() {
  //   fetch data and save to memory
  //   this.loadDataFromDB();
  //   save the canvas memory to database
  //   this.task.handleCron();
  // }

  // private async loadDataFromDB() {
  //   const pixels = await this.prisma.pixel.findMany({
  //     where: {
  //       canvasId: 1,
  //     },
  //     select: {
  //       x: true,
  //       y: true,
  //       color: true,
  //       user: {
  //         select: {
  //           name: true,
  //         },
  //       },
  //     },
  //   });

  //   pixels.forEach((p) => {
  //     const pixel = {
  //       x: p.x,
  //       y: p.y,
  //       color: p.color,
  //       user: p.user?.name ?? null,
  //     };

  //     this.canvas.set(`${p.x},${p.y}`, pixel);
  //   });

  //   console.log(`Loaded ${pixels.length} pixels from database`);
  // }

  async create(createCanvasDto: CreateCanvasDto) {
    await this.prisma.canvas.create({
      data: {
        name: createCanvasDto.name.toUpperCase(),
        gridSize: parseInt(createCanvasDto.gridSize),
      },
    });

    return 'Canvas created successfully';
  }

  async findOne(canvasId: number) {
    const canvas = await this.prisma.canvas.findUnique({
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

    if (!canvas) {
      throw new NotFoundException('Canvas not found');
    }

    return { ...canvas };
  }

  async updateCanvasPixel(canvasId: number, updateCanvasDto: UpdateCanvasDto) {
    let user = await this.prisma.user.findUnique({
      where: { id: updateCanvasDto.userId },
      select: { id: true, charges: true, cooldownUntil: true, name: true },
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

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        charges: newCharges,
        cooldownUntil: newCooldown,
        totalPixelsPlaced: { increment: 1 },
      },
    });

    // check x and y bounds
    if (
      updateCanvasDto.x < 0 ||
      updateCanvasDto.x >= 299 ||
      updateCanvasDto.y < 0 ||
      updateCanvasDto.y >= 299
    ) {
      throw new BadRequestException('Invalid coordinates');
    }

    const res = await this.prisma.pixel.upsert({
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

    const pixel = {
      x: res.x,
      y: res.y,
      color: res.color,
      userId: user.id,
    };

    // this.socket.server.broadcast.emit('pixel', {});
    this.socket.handleUpdatedPixel(pixel);

    return 'Canvas updated successfully';
  }

  remove(id: number) {
    return `This action removes a #${id} canva`;
  }
}
