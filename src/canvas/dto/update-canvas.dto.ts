import { PartialType } from '@nestjs/mapped-types';
import { CreateCanvasDto } from './create-canvas.dto';
import { User } from '@repo/types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCanvasDto extends PartialType(CreateCanvasDto) {
  @IsNumber()
  @IsNotEmpty()
  x: number;
  @IsNumber()
  @IsNotEmpty()
  y: number;
  @IsString()
  @IsNotEmpty()
  color: string;
  @IsString()
  @IsNotEmpty()
  userId: User['id'];
}
