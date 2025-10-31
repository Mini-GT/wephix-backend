import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateGuildDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Guild name must be at least 3 characters long' })
  @MaxLength(16, {
    message: 'Guild name must not be more than 16 characters long',
  })
  guildName: string;
}
