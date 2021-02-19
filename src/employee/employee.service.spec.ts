import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import TestEmployee from './test/TestEmployee';

describe('EmployeeService', () => {
  let service: EmployeeService;
  const fakeEmployeeModel = {
    find: jest.fn(),
    populate: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deletePic: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getModelToken('Employee'),
          useValue: fakeEmployeeModel,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find All Employee', () => {
    it('should be a employee', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      fakeEmployeeModel.find.mockReturnValue([employee, employee]);
      const employees = await service.findAll();
      expect(employees).toHaveLength(2);
      expect(fakeEmployeeModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('find one employee', () => {
    it('should be a employee', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      fakeEmployeeModel.findOne.mockReturnValue(employee);
      const foundEmpoylee = await service.findOne('600986480dcc0d351c73a716');
      expect(foundEmpoylee).toMatchObject({
        email: employee.email,
      });
      // expect(fakeEmployeeModel.findOne).toBeCalledTimes(1);
    });

    it('should return a exception does not to find a employee', async () => {
      fakeEmployeeModel.findOne.mockReturnValue(null);
      await service.findOne('600986480dcc0d351c73a718').catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
      });
      // expect(fakeEmployeeModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find employee', () => {
    it('should be a employee in department', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      fakeEmployeeModel.find.mockReturnValue(employee);
      const viewEmployee = await service.viewEmploy('60093413a7e4d542880ce98f');
      expect(viewEmployee).toMatchObject({
        department_id: employee.department_id,
      });
      expect(fakeEmployeeModel.find).toBeCalledTimes(2);
    });
  });

  describe('create a employee', () => {
    it('should be a employee', async () => {
      const file = { filename: 'adfajdfadjkfl.jpg' };
      const employee = TestEmployee.giveAValidEmployee();
      employee.photo = file.filename;
      fakeEmployeeModel.create.mockReturnValue(employee);
      const saveEmployee = await service.create(employee, file);
      expect(employee).toBe(saveEmployee);
    });

    it('should be a employee, is exist email and phone', async () => {
      const file = { filename: 'adfajdfadjkfl.jpg' };
      const employee = TestEmployee.giveAValidEmployee();
      await service.create(employee, file).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('update a employee', () => {
    it('should be a employee, is exist file', async () => {
      const file = { filename: 'adfadfdasfaadf.jpg' };
      const employee = TestEmployee.giveAValidEmployee();
      fakeEmployeeModel.findOne.mockReturnValue(employee);
      fakeEmployeeModel.findByIdAndUpdate.mockReturnValue(employee);
      const update = await service.update(
        '600985b1dbd6f44cd89b2ad6',
        employee,
        file,
      );
      expect(update).toMatchObject(employee);
    });
    it('should be a employee, not exist file', async () => {
      const file = null;
      const employee = TestEmployee.giveAValidEmployee();
      fakeEmployeeModel.findOne.mockReturnValue(employee);
      fakeEmployeeModel.findByIdAndUpdate.mockReturnValue(employee);
      const update = await service.update(
        '600985b1dbd6f44cd89b2ad6',
        employee,
        file,
      );
      expect(update).toMatchObject(employee);
    });
  });

  describe('delete a employee', () => {
    it('should return a exception does not to find a employee', async () => {
      fakeEmployeeModel.findOne.mockReturnValue(null);
      await service.findOne('600986480dcc0d351c73a718').catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
      });
      // expect(fakeEmployeeModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should be a employee', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      fakeEmployeeModel.findOne.mockReturnValue(employee);
      fakeEmployeeModel.findOneAndDelete.mockReturnValue(employee);

      const deleted = await service.remove('600986480dcc0d351c73a716');

      expect(deleted).toBe(employee);
      expect(fakeEmployeeModel.findOne).toHaveBeenCalledTimes(9);
      expect(fakeEmployeeModel.findOneAndDelete).toHaveBeenCalledTimes(1);
    });
  });
});
