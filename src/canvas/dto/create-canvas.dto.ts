import { IsAlpha, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateCanvasDto {
  @IsAlpha(undefined, { message: 'Name must contain only letters' })
  name: string;

  @IsNumberString({}, { message: 'Grid size must be a number' })
  @IsNotEmpty({ message: 'Grid size cannot be empty' })
  gridSize: string;
}
