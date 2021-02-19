import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './entities/employee.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private EmployeeModel: Model<EmployeeDocument>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    file: any,
  ): Promise<EmployeeDocument> {
    const [checkEmail, checkPhone] = await Promise.all([
      this.EmployeeModel.findOne({
        email: createEmployeeDto.email,
      }),
      this.EmployeeModel.findOne({
        cellphone: createEmployeeDto.cellphone,
      }),
    ]);
    if (checkEmail) throw new BadRequestException('Email is exist');
    if (checkPhone) throw new BadRequestException('Phone is exist');

    createEmployeeDto.photo = file.filename;
    const create = await this.EmployeeModel.create(createEmployeeDto);
    return create;
  }

  async findAll(): Promise<EmployeeDocument[]> {
    const all = await this.EmployeeModel.find();
    return all;
  }

  async findOne(id: string): Promise<EmployeeDocument> {
    const employee = await this.EmployeeModel.findOne({ _id: id });
    if (!employee) {
      throw new NotFoundException('not found employee');
    }
    return employee;
  }

  async viewEmploy(id: any) {
    return await this.EmployeeModel.find({ department_id: id });
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    file: any,
  ): Promise<EmployeeDocument> {
    if (file) {
      const check = await this.findOne(id);

      await fs.unlinkSync('photo/' + check.photo);
      updateEmployeeDto.photo = file.filename;
      const update = await this.EmployeeModel.findByIdAndUpdate(
        id,
        updateEmployeeDto,
        { new: true },
      );
      return update;
    } else {
      const update = await this.EmployeeModel.findByIdAndUpdate(
        id,
        {
          $set: {
            name: updateEmployeeDto.name,
            jobtitle: updateEmployeeDto.jobtitle,
            cellphone: updateEmployeeDto.cellphone,
            email: updateEmployeeDto.email,
            department_id: updateEmployeeDto.department_id,
          },
        },
        { new: true },
      );
      return update;
    }
  }

  async remove(id: string): Promise<EmployeeDocument> {
    const check = await this.findOne(id);
    await fs.unlinkSync('photo/' + check.photo);
    return await this.EmployeeModel.findOneAndDelete({ _id: id });
  }
}
