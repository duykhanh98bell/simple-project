/* eslint-disable prettier/prettier */
import { Department } from '../entities/department.entity';

export default class TestUtil {
  static giveAMeAValidDepartment(): Department {
    const department = new Department();
    department.manager = 'trungnt';
    department.name = 'PM';
    department.officephone = '0987654321';
    return department;
  }
}
