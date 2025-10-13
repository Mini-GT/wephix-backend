import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid email' })
  @Matches(/^\S+$/, { message: 'Email must not contain spaces' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^\S+$/, { message: 'Password must not contain spaces' })
  password: string;
}
