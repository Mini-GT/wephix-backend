import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import { InspectCanvasDto } from './dto/inspect-canvas.dto';
import { type AuthenticatedRequest } from '../types/express';
import { Throttle } from '@nestjs/throttler';

@Controller('api/v1/canvas')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @Post('create')
  create(@Body() createCanvasDto: CreateCanvasDto) {
    return this.canvasService.create(createCanvasDto);
  }

  @Post('inspect/:canvasId')
  inspectCanvasCell(
    @Param('canvasId') canvasId: string,
    @Body() inspectCanvasDto: InspectCanvasDto,
  ) {
    return this.canvasService.inspectCanvasCell(+canvasId, inspectCanvasDto);
  }

  @Get(':canvasId')
  findOne(@Param('canvasId') canvasId: string) {
    return this.canvasService.findOne(+canvasId);
  }

  @Throttle({ default: { limit: 1, ttl: 300 } })
  @Patch(':canvasId')
  updateCanvasPixel(
    @Param('canvasId') canvasId: string,
    @Body() updateCanvasDto: UpdateCanvasDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canvasService.updateCanvasPixel(
      +canvasId,
      req.userId,
      updateCanvasDto,
    );
  }
}
