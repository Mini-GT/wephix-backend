import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { type AuthenticatedRequest } from '../types/express';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/paint-charges')
  getPaintCharges(@Req() req: AuthenticatedRequest) {
    return this.usersService.getPaintCharges(req.userId);
  }

  @Get()
  findOne(@Req() req: AuthenticatedRequest) {
    return this.usersService.getUserById(req.userId);
  }

  @Patch('/profile/update')
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.userId, updateUserDto);
  }

  @Get('/all')
  getAllUsers(@Query('page') page: string) {
    return this.usersService.getAllUsers(+page);
  }

  @Delete()
  remove(@Req() req: AuthenticatedRequest) {
    return this.usersService.remove(+req.userId);
  }
}
