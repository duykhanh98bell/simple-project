import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department, DepartmentDocument } from './entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private DepartmentModel: Model<DepartmentDocument>,
  ) {}

  async create(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentDocument> {
    const depart = await this.DepartmentModel.create(createDepartmentDto);
    return depart;
  }

  async checkDepartment(name: string) {
    const check = await this.DepartmentModel.findOne({
      name: name,
    });
    return check;
  }

  async findAll(): Promise<DepartmentDocument[]> {
    return await this.DepartmentModel.find();
  }

  async findOne(id: string): Promise<DepartmentDocument | undefined> {
    return await this.DepartmentModel.findOne({ _id: id });
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentDocument> {
    return await this.DepartmentModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateDepartmentDto,
      },
      { new: true },
    );
  }

  async remove(id: string): Promise<DepartmentDocument> {
    return await this.DepartmentModel.findOneAndDelete({ _id: id });
  }
}
