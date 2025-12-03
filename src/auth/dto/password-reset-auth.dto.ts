import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class PasswordResetDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid email' })
  @Matches(/^\S+$/, { message: 'Input must not contain spaces' })
  email: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmNewPassword: string;
}
