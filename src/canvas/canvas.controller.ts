import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';

@Controller('api/v1/canvas')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @Post('create')
  create(@Body() createCanvasDto: CreateCanvasDto) {
    return this.canvasService.create(createCanvasDto);
  }

  // @Get()
  // getMainCanvas() {
  //   return this.canvasService.getMainCanvas();
  // }

  @Get(':canvasId')
  findOne(@Param('canvasId') canvasId: string) {
    return this.canvasService.findOne(+canvasId);
  }

  @Patch(':canvasId')
  updateCanvasPixel(
    @Param('canvasId') canvasId: string,
    @Body() updateCanvasDto: UpdateCanvasDto,
  ) {
    return this.canvasService.updateCanvasPixel(+canvasId, updateCanvasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.canvasService.remove(+id);
  }
}
