import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department, DepartmentSchema } from './entities/department.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService } from 'src/employee/employee.service';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
    ]),
  ],
})
export class DepartmentModule {}
