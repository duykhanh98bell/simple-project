import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import TestUser from './test/TestUser';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const fakeController = {
    findAll: jest.fn(),
    checkUsername: jest.fn(),
    checkEmail: jest.fn(),
    create: jest.fn(),
    read: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: fakeController,
        },
      ],
    }).compile();

    beforeEach(() => {
      fakeController.findAll.mockReset();
      fakeController.checkEmail.mockReset();
      fakeController.checkUsername.mockReset();
      fakeController.create.mockReset();
      fakeController.read.mockReset();
      fakeController.remove.mockReset();
    });

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create user', () => {
    it('should be a new user', async () => {
      const user = TestUser.giveAValidUser();
      // user.email = 'dafd@gmail.com';
      // user.username = 'fadfasdfakjsdf';
      fakeController.create.mockReturnValue(user);
      const newUser = await controller.create(user);
      expect(newUser.newUser.email).toBe(fakeController.create().email);
    });
    it('throw badrequest', async () => {
      const user = TestUser.giveAValidUser();
      user.email = 'dafd@gmail.com';
      fakeController.checkUsername.mockReturnValue(BadRequestException);
      await controller.create(user).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e).toMatchObject({ message: 'Username is exist' });
      });
    });
    it('throw badrequest', async () => {
      const user = TestUser.giveAValidUser();
      user.username = 'fadfasdfakjsdf';
      fakeController.checkEmail.mockReturnValue(BadRequestException);
      await controller.create(user).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e).toMatchObject({ message: 'Email is exist' });
      });
    });
  });

  describe('find User', () => {
    it('should be a user', async () => {
      const user = TestUser.giveAValidUser();
      fakeController.read.mockReturnValue([user, user]);
      await controller.read();
      expect(fakeController.read()).toHaveLength(2);
    });
  });

  describe('remove user', () => {
    it('should be a user removed', async () => {
      const user = TestUser.giveAValidUser();
      fakeController.remove.mockReturnValue(user);
      const removed = await controller.remove('6009062e53c4c9948c62f93b');
      expect(removed.email).toBe(fakeController.remove().email);
    });
  });
});
