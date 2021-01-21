import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Department } from 'src/department/entities/department.entity';
import * as mongoose from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop()
  photo: string;

  @Prop({ required: true })
  jobtitle: string;

  @Prop({ required: true, unique: true })
  cellphone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Department' })
  department_id: Department;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
