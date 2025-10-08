import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateCanvasDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  @IsNotEmpty()
  gridSize: string;
}
