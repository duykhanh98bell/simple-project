/* eslint-disable prettier/prettier */
import { Department } from '../../department/entities/department.entity';
import { Employee } from '../entities/employee.entity';

export default class TestCreateEmployee {
  static giveAValidEmployee(): Employee {
    const employee = new Employee();
    employee.department_id = new Department();
    employee.name = 'Le Huy Hung';
    employee.jobtitle = 'Dev .Net';
    employee.cellphone = '1111111116';
    employee.email = 'huyhung@gmail.com';
    employee.department_id.manager = 'khanhdd';
    employee.department_id.name = 'Develop';
    employee.department_id.officephone = '0336378689';
    employee.photo = 'photo.JPG';
    return employee;
  }
}
