import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department, DepartmentDocument } from './entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private DepartmentModel: Model<DepartmentDocument>,
    private EmployeeService: EmployeeService,
  ) {}

  async create(
    createDepartmentDto: CreateDepartmentDto,
    res: any,
  ): Promise<DepartmentDocument> {
    const check = await this.DepartmentModel.findOne({
      name: createDepartmentDto.name,
    });
    if (check) return res.json({ message: 'Tên phòng ban đã tồn tại' });
    const depart = await this.DepartmentModel.create(createDepartmentDto);
    return depart;
  }

  async findAll(): Promise<DepartmentDocument[]> {
    return await this.DepartmentModel.find();
  }

  async findOne(id: string): Promise<DepartmentDocument | undefined> {
    return await this.DepartmentModel.findById(id);
  }

  async view(id: any) {
    return await this.EmployeeService.viewEmploy(id);
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentDocument> {
    const updateDepart = await this.DepartmentModel.findByIdAndUpdate(
      id,
      updateDepartmentDto,
      { new: true },
    );
    return updateDepart;
  }

  async remove(id: string): Promise<DepartmentDocument> {
    const dlt = await this.DepartmentModel.findByIdAndDelete(id);
    return dlt;
  }
}
