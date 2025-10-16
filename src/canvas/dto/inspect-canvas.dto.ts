import { PickType } from '@nestjs/mapped-types';
import { UpdateCanvasDto } from './update-canvas.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class InspectCanvasDto extends PickType(UpdateCanvasDto, [
  'x',
  'y',
] as const) {}
