import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  @IsString()
  email: string;
}
