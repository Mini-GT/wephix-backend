import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @Matches(/^\S+$/, { message: 'Input must not contain spaces' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid email' })
  @Matches(/^\S+$/, { message: 'Input must not contain spaces' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^\S+$/, { message: 'Input must not contain spaces' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\S+$/, { message: 'Input must not contain spaces' })
  confirmPassword: string;
}
