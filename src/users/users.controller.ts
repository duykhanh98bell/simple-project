import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../login/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const checkUsername = await this.usersService.checkUsername(
      createUserDto.username,
    );
    if (checkUsername) throw new BadRequestException('Username is exist');

    const checkEmail = await this.usersService.checkEmail(createUserDto.email);
    if (checkEmail) throw new BadRequestException('Email is exist');

    const newUser = await this.usersService.create(createUserDto);

    return {
      // message: 'Tao tai khoan thanh cong',
      newUser,
    };
  }

  @Get()
  read() {
    return this.usersService.read();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
