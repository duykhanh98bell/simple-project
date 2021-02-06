import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ): Promise<
    | {
        message: string;
        create: EmployeeDocument;
      }
    | { message: string }
  > {
    const [checkEmail, checkPhone] = await Promise.all([
      this.EmployeeModel.findOne({
        email: createEmployeeDto.email,
      }),
      this.EmployeeModel.findOne({
        cellphone: createEmployeeDto.cellphone,
      }),
    ]);
    if (checkEmail)
      throw new HttpException('Email is exist', HttpStatus.BAD_REQUEST);
    if (checkPhone)
      throw new HttpException('Phone is exist', HttpStatus.BAD_REQUEST);

    createEmployeeDto.photo = file.filename;
    const create = await this.EmployeeModel.create(createEmployeeDto);
    return {
      message: 'Tạo thành công',
      create,
    };
  }

  async findAll(): Promise<EmployeeDocument[]> {
    const all = await this.EmployeeModel.find().populate('department_id');
    return all;
  }

  async findOne(id: string): Promise<EmployeeDocument> {
    const updateOne = await this.EmployeeModel.findById(id);
    return updateOne;
  }

  async viewEmploy(id: any) {
    return await this.EmployeeModel.find({ department_id: id });
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    file: any,
  ): Promise<{
    message: string;
    update: EmployeeDocument;
  }> {
    if (file) {
      const check = await this.EmployeeModel.findById(id);
      await fs.unlinkSync('photo/' + check.photo);
      updateEmployeeDto.photo = file.filename;
      const update = await this.EmployeeModel.findByIdAndUpdate(
        id,
        updateEmployeeDto,
        { new: true },
      );
      return {
        message: 'Cap nhat thanh cong',
        update,
      };
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
      return {
        message: 'Cap nhat thanh cong',
        update,
      };
    }
  }

  async remove(id: string): Promise<EmployeeDocument> {
    const check = await this.EmployeeModel.findById(id);
    await fs.unlinkSync('photo/' + check.photo);
    const dele = await this.EmployeeModel.findByIdAndDelete(id);
    return dele;
  }
}
