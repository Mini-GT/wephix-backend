import { Injectable } from '@nestjs/common';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import prisma from 'src/prismaClient';

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

  findAll() {
    return `This action returns all canvas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} canva`;
  }

  updateCanvas(canvasId: string, updateCanvasDto: UpdateCanvasDto) {
    console.log(canvasId);
    // return `This action updates a #${id} canva`;
  }

  remove(id: number) {
    return `This action removes a #${id} canva`;
  }
}
