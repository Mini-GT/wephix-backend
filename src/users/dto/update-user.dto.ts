import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @MinLength(3, {
    message: 'New name must be at least 3 characters long',
  })
  @MaxLength(20, {
    message: 'New name must not be more than 20 characters long',
  })
  newName?: string;

  @IsString()
  currentName: string;

  @IsString()
  @IsOptional()
  @MinLength(6, {
    message: 'Current password must be at least 6 characters long',
  })
  @MaxLength(40, {
    message: 'Current password must not be more than 40 characters long',
  })
  currentPassword?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  @MaxLength(40, {
    message: 'New password must not be more than 40 characters long',
  })
  newPassword?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, {
    message: 'Confirm password must be at least 6 characters long',
  })
  @MaxLength(40, {
    message: 'Confirm password must not be more than 40 characters long',
  })
  confirmPassword?: string;

  @IsString()
  @IsOptional()
  currentProfileImage?: string;

  @IsString()
  @IsOptional()
  newProfileImage?: string;
}
