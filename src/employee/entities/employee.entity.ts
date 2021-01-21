import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
