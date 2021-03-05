/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from '../employee/employee.service';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
const httpMocks = require('node-mocks-http');

describe('DepartmentController', () => {
  let controller: DepartmentController;
  let service: DepartmentService;
  let employeeService: EmployeeService;
  const fakeDepartmentModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkDepartment: jest.fn(),
  };
  const fakeEmployeeModel = {
    viewEmploy: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [
        DepartmentService,
        {
          provide: DepartmentService,
          useValue: fakeDepartmentModel,
        },
        EmployeeService,
        {
          provide: EmployeeService,
          useValue: fakeEmployeeModel,
        },
      ],
    }).compile();

    controller = module.get<DepartmentController>(DepartmentController);
    service = module.get<DepartmentService>(DepartmentService);
    employeeService = module.get<EmployeeService>(EmployeeService);
  });
  beforeEach(() => {
    fakeDepartmentModel.findAll.mockReset();
    fakeDepartmentModel.findOne.mockReset();
    fakeDepartmentModel.create.mockReset();
    fakeDepartmentModel.update.mockReset();
    fakeDepartmentModel.remove.mockReset();
    fakeDepartmentModel.checkDepartment.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find all', () => {
    const department = {
      name: 'Sale',
      officephone: '0123456789',
      manager: 'Hungtd',
    };
    it('should be array department', async () => {
      fakeDepartmentModel.findAll.mockReturnValue([department, department]);
      const departments = await controller.findAll();
      expect(departments).toHaveLength(2);
    });
  });

  describe('find One', () => {
    const department = {
      name: 'Sale',
      officephone: '0123456789',
      manager: 'Hungtd',
    };
    it('should be a department', async () => {
      fakeDepartmentModel.findOne.mockReturnValue(department);
      const findDepartment = await controller.findOne(
        '60093345d43ea92e7496d375',
      );
      expect(findDepartment).toMatchObject({ name: department.name });
    });

    it('should be a notfoundexception', async () => {
      fakeDepartmentModel.findOne.mockReturnValue(null);
      await controller.findOne('60093345d43ea92e7496d37x').catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e).toMatchObject({ message: 'Department not Found' });
      });
    });
  });

  describe('view employee', () => {
    const employee = {
      name: 'Le Huy Hung',
      jobtitle: 'Dev .Net',
      cellphone: '1111111116',
      email: 'huyhung@gmail.com',
      department_id: '60093413a7e4d542880ce98f',
      photo: 'photo-1611236785876-897522478.JPG',
    };
    it('should be array emloyee', async () => {
      fakeEmployeeModel.viewEmploy.mockReturnValue([employee, employee]);
      const employees = await controller.viewEmployee(
        '60093345d43ea92e7496d375',
      );
      expect(employees).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('should be a department', async () => {
      const department = {
        name: 'PMvv',
        officephone: '0987654321',
        manager: 'trungnt',
      };
      const req = httpMocks.createRequest();
      req.res = httpMocks.createResponse();
      fakeDepartmentModel.create.mockReturnValue(department);
      await controller.create(department, req.res);
      expect(department).toBe(fakeDepartmentModel.create());
    });

    it('should be a BadrequestException', async () => {
      const department = {
        name: 'Sale',
        officephone: '0123456789',
        manager: 'Hungtd',
      };
      const req = httpMocks.createRequest();
      req.res = httpMocks.createResponse();
      fakeDepartmentModel.checkDepartment.mockReturnValue(BadRequestException);

      await controller.create(department, req.res).catch((e) => {
        expect(e).toBeInstanceOf(fakeDepartmentModel.checkDepartment());
        expect(e).toMatchObject({ message: 'name is unique' });
      });
    });
  });

  describe('update department', () => {
    it('should be a department', async () => {
      const department = {
        name: 'Salexx',
        officephone: '0123456789xx',
        manager: 'Hungtdxx',
      };
      fakeDepartmentModel.update.mockReturnValue(department);
      const updated = await controller.update(
        '60093345d43ea92e7496d375',
        department,
      );
      expect(updated.updateDepart.name).toBe(fakeDepartmentModel.update().name);
    });
  });

  describe('remove department', () => {
    it('should be a message and department', async () => {
      const department = {
        name: 'Sale',
        officephone: '0123456789',
        manager: 'Hungtd',
      };
      fakeDepartmentModel.remove.mockReturnValue(department);
      const removed = await controller.remove('60093345d43ea92e7496d375');
      expect(removed.dlt.name).toBe(fakeDepartmentModel.remove().name);
    });
  });
});
