import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import TestEmployee from './test/TestEmployee';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  const fakeController = {
    findAll: jest.fn(),
    findOneEmploye: jest.fn(),
    create: jest.fn(),
    checkEmail: jest.fn(),
    checkPhone: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        EmployeeService,
        {
          provide: EmployeeService,
          useValue: fakeController,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
  });
  beforeEach(() => {
    fakeController.findAll.mockReset();
    fakeController.create.mockReset();
    fakeController.checkEmail.mockReset();
    fakeController.checkPhone.mockReset();
    fakeController.findOneEmploye.mockReset();
    fakeController.update.mockReset();
    fakeController.remove.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be a employee', async () => {
      const file = { filename: 'photo.JPG' };
      const employee = TestEmployee.giveAValidEmployee();
      fakeController.create.mockReturnValue(employee);
      const saveEmployee = await controller.create(employee, file);
      // saveEmployee.saveEmployee.photo = file.filename;
      expect(saveEmployee.saveEmployee.name).toBe(fakeController.create().name);
    });

    it('should be a badrequestexception', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      const file = { filename: 'photo.JPG' };
      employee.cellphone = '0000000000';
      // fakeController.create.mockReturnValue(TypeError);
      fakeController.checkEmail.mockReturnValue(BadRequestException);
      await controller.create(employee, file).catch((e) => {
        expect(e).toBeInstanceOf(fakeController.checkEmail());
      });
    });

    it('should be a badrequestexception', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      const file = { filename: 'photo.JPG' };
      employee.email = 'abc@gmail.com';
      // fakeController.create.mockReturnValue(TypeError);
      fakeController.checkPhone.mockReturnValue(BadRequestException);
      await controller.create(employee, file).catch((e) => {
        expect(e).toBeInstanceOf(fakeController.checkPhone());
      });
    });
  });
  describe('find All', () => {
    it('should be array employee', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      fakeController.findAll.mockReturnValue([employee, employee]);
      await controller.findAll();
      expect(fakeController.findAll()).toHaveLength(2);
    });
  });
  describe('find One', () => {
    it('should be a employee', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      fakeController.findOneEmploye.mockReturnValue(employee);
      const findEmployee = await controller.findOne('600985b1dbd6f44cd89b2ad6');
      expect(findEmployee.email).toBe(fakeController.findOneEmploye().email);
    });
  });
  describe('update employee', () => {
    it('should be a employee updated', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      const file = { filename: 'photo.JPG' };
      fakeController.update.mockReturnValue(employee);
      const updateEmployee = await controller.update(
        '600985b1dbd6f44cd89b2ad6',
        employee,
        file,
      );
      expect(updateEmployee.postUpdate.email).toBe(
        fakeController.update().email,
      );
    });
  });
  describe('remove employee', () => {
    it('should be a employee removed', async () => {
      const employee = TestEmployee.giveAValidEmployee();
      fakeController.remove.mockReturnValue(employee);
      const removedEmployee = await controller.remove(
        '600985b1dbd6f44cd89b2ad6',
      );
      expect(removedEmployee.dele.email).toBe(fakeController.remove().email);
    });
  });
});
