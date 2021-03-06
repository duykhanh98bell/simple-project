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
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import { JwtAuthGuard } from '../login/jwt-auth.guard';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@UseGuards(JwtAuthGuard)
@Controller('department')
@UsePipes(new ValidationPipe())
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Res() res: any,
  ) {
    const checkDepartment = await this.departmentService.checkDepartment(
      createDepartmentDto.name,
    );
    if (checkDepartment) throw new BadRequestException('name is unique');

    const depart = await this.departmentService.create(createDepartmentDto);
    return res.json({
      // message: 'Tao thanh cong',
      depart,
    });
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const checkDepartment = await this.departmentService.findOne(id);
    if (!checkDepartment) {
      throw new NotFoundException('Department not Found');
    }
    return checkDepartment;
  }

  @Get('employeein/:id')
  async viewEmployee(@Param('id') id: string) {
    return await this.employeeService.viewEmploy(id);
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
      // message: 'Cap nhat thanh cong',
      updateDepart,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const dlt = await this.departmentService.remove(id);
    return {
      // message: 'Xoa thanh cong',
      dlt,
    };
  }
}
