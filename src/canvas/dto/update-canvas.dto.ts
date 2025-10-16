import { User } from '@repo/types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCanvasDto {
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
