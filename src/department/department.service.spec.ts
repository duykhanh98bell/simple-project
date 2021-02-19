import { BadRequestException, NotFoundException } from '@nestjs/common';
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
      expect(departmentFound).toMatchObject({ name: department.name });
      expect(fakeDepartmentModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when does not to find a department', async () => {
      fakeDepartmentModel.findOne.mockReturnValue(null);
      await service.findOne('600984b3b7486652e06d87dd').catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
      });
      // expect(fakeDepartmentModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Create Department', () => {
    it('should create a department', async () => {
      const department = TestUtil.giveAMeAValidDepartment();
      fakeDepartmentModel.save.mockReturnValue(department);
      fakeDepartmentModel.create.mockReturnValue(department);
      const saveDepartment = await service.create(department);
      expect(saveDepartment).toMatchObject(department);
      expect(fakeDepartmentModel.create).toHaveBeenCalledTimes(1);
      // expect(fakeDepartmentModel.save).toHaveBeenCalledTimes(1);
    });

    it('should return bad request', async () => {
      const departmentDemo = {
        name: 'PM',
        officephone: '0987654321',
        manager: 'trungnt',
      };

      await service.check(departmentDemo.name).catch((e) => {
        expect(e).toBe(null);
      });
      await service.create(departmentDemo).catch((err) => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err).toMatchObject({
          message: 'name is unique',
        });
      });
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
