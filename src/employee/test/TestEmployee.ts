/* eslint-disable prettier/prettier */
import { Department } from '../../department/entities/department.entity';
import { Employee } from '../entities/employee.entity';

export default class TestEmployee {
  static giveAValidEmployee(): Employee {
    const employee = new Employee();
    employee.department_id = new Department();
    employee.name = 'Duy Khanh';
    employee.jobtitle = 'Dev PHP, NodeJS';
    employee.cellphone = '0336378689';
    employee.email = 'duykhanh98bell@gmail.com';
    employee.department_id.manager = 'khanhdd';
    employee.department_id.name = 'Develop';
    employee.department_id.officephone = '0336378689';
    employee.photo = 'photo-1611236936620-103255893.JPG';
    return employee;
  }
}
