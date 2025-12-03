import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller('api/v1/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/forgot/password')
  create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.forgotPassword(createEmailDto.email);
  }
}
