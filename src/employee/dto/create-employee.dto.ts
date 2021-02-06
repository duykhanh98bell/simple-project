import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Department } from '../../department/entities/department.entity';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'Tên không được bỏ trống' })
  @Length(5, 25, { message: 'Tên từ 5 - 25 kí tự' })
  name: string;

  photo: string;

  @IsNotEmpty({ message: 'Tên công việc không đc bỏ trống' })
  @Length(1, 25, { message: 'Tên công việc không được quá 25 kí tự' })
  jobtitle: string;

  @IsNotEmpty({ message: 'Số điện thoại không đc để trống' })
  @Length(10, 10, { message: 'Số điện thoại chỉ 10 số' })
  cellphone: string;

  @IsNotEmpty({ message: 'Email không đc để trống' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Phòng ban k đc trống' })
  department_id: Department;
}
