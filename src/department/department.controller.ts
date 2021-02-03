import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/login/jwt-auth.guard';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@UseGuards(JwtAuthGuard)
@Controller('department')
@UsePipes(new ValidationPipe())
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Res() res: any,
  ) {
    const depart = await this.departmentService.create(
      createDepartmentDto,
      res,
    );
    return res.json({
      message: 'Tao thanh cong',
      depart,
    });
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Get('employeein/:id')
  async viewEmployee(@Param('id') id: string) {
    return await this.departmentService.view(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: any,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    const updateDepart = await this.departmentService.update(
      id,
      updateDepartmentDto,
    );
    return {
      message: 'Cap nhat thanh cong',
      updateDepart,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const dlt = await this.departmentService.remove(id);
    return {
      message: 'Xoa thanh cong',
      dlt,
    };
  }
}
