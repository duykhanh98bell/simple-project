import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import TestUtil from './test/TestUtil';

describe('DepartmentService', () => {
  let service: DepartmentService;
  const fakeDepartmentModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    check: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: getModelToken('Department'),
          useValue: fakeDepartmentModel,
        },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find all Department ', () => {
    it('should be list  all department', async () => {
      const department = TestUtil.giveAMeAValidDepartment();
      fakeDepartmentModel.find.mockReturnValue([department, department]);
      const departments = await service.findAll();
      expect(departments).toHaveLength(2);
      expect(fakeDepartmentModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('find One department', () => {
    it('should be a department', async () => {
      const department = TestUtil.giveAMeAValidDepartment();
      fakeDepartmentModel.findOne.mockReturnValue(department);
      const departmentFound = await service.findOne('600984b3b7486652e06d87de');
      expect(departmentFound.name).toBe(fakeDepartmentModel.findOne().name);
    });

    it('should return a exception when does not to find a department', async () => {
      fakeDepartmentModel.findOne.mockReturnValue(NotFoundException);
      await service.findOne('600984b3b7486652e06d87dd').catch((err) => {
        expect(err).toBeInstanceOf(fakeDepartmentModel.findOne());
      });
      // expect(fakeDepartmentModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Create Department', () => {
    it('should create a department', async () => {
      const departmentxx = {
        name: 'PMMM',
        officephone: '0987654321',
        manager: 'trungnnnnn',
      };
      fakeDepartmentModel.create.mockReturnValue(departmentxx);
      const saveDepartment = await service.create(departmentxx);
      expect(saveDepartment.name).toBe(departmentxx.name);
    });
  });

  describe('check create department', () => {
    it('should be a department', async () => {
      const department = TestUtil.giveAMeAValidDepartment();
      fakeDepartmentModel.findOne.mockReturnValue(department);

      expect(await service.checkDepartment(department.name)).toBe(
        fakeDepartmentModel.findOne(),
      );
    });
  });

  describe('Update Department', () => {
    it('should update a department', async () => {
      const department = TestUtil.giveAMeAValidDepartment();
      const updateDepartment = {
        name: 'tuongpm',
        officephone: '0321654789',
        manager: 'BA',
      };
      fakeDepartmentModel.findOneAndUpdate.mockReturnValue({
        ...department,
        ...updateDepartment,
      });

      const result = await service.update('600984b3b7486652e06d87de', {
        ...updateDepartment,
      });
      expect(result).toMatchObject(updateDepartment);
      // expect(fakeDepartmentModel.update).toBeCalledTimes(1);
    });
  });

  describe('delete Department', () => {
    it('should delete a department', async () => {
      const department = TestUtil.giveAMeAValidDepartment();
      fakeDepartmentModel.findOneAndDelete.mockReturnValue(department);
      const deleteDepartment = await service.remove('600984b3b7486652e06d87de');
      expect(deleteDepartment).toMatchObject(department);
      expect(fakeDepartmentModel.findOneAndDelete).toBeCalledTimes(1);
    });
  });
});
