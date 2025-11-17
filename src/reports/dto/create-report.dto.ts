import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  @MinLength(10, { message: 'Message must be at least 10 characters long' })
  @MaxLength(1000, {
    message: 'Message  must not be more than 1000 characters long',
  })
  message: string;
}
