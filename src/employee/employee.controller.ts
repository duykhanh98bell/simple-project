/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import path = require('path');
import { JwtAuthGuard } from 'src/login/jwt-auth.guard';
const multer = require('multer');

export const storage = {
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'photo');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension: string = path.parse(file.originalname).ext;
      cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    },
  }),
};

@UseGuards(JwtAuthGuard)
@Controller('employee')
@UsePipes(new ValidationPipe())
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', storage))
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file: any,
  ) {
    return this.employeeService.create(createEmployeeDto, file);
  }

  @Get()
  async findAll() {
    const all = await this.employeeService.findAll();
    return {
      message: 'Tất cả employee',
      all,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo', storage))
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file: any,
  ) {
    return this.employeeService.update(id, updateEmployeeDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const dele = await this.employeeService.remove(id);
    return {
      message: 'Xoa thanh cong',
      dele,
    };
  }
}
