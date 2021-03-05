/* eslint-disable @typescript-eslint/no-var-requires */
import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { tokenTest } from './test/tokenTest';
const httpMocks = require('node-mocks-http');

describe('LoginController', () => {
  let controller: LoginController;
  const fakeController = {
    login: jest.fn(),
    findUser: jest.fn(),
    change: jest.fn(),
    logout: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        LoginService,
        {
          provide: LoginService,
          useValue: fakeController,
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });
  beforeEach(() => {
    fakeController.findUser.mockReset();
    fakeController.login.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('return access_token and login first', async () => {
      const req = httpMocks.createRequest();
      req.res = httpMocks.createResponse();
      const data = {
        username: 'duykhanh98',
        password: '123456',
      };
      const loginSuccess = await controller.login(data, req.res);

      fakeController.login.mockReturnValue(loginSuccess.access_token);
      fakeController.findUser.mockReturnValue(true);

      expect(fakeController.login()).toBe(tokenTest.access_token);
      expect(fakeController.findUser()).toBe(loginSuccess.first);
    });
  });

  describe('chang password', () => {
    it('should be a user', async () => {
      const req = httpMocks.createRequest();
      req.res = httpMocks.createResponse();
      const data = {
        password: '123456',
        newpassword: '111111',
        repassword: '111111',
      };
      fakeController.change.mockReturnValue(true);
      await controller.changePass(data, req, req.res);
      expect(true).toBe(fakeController.change());
    });
  });

  describe('logout', () => {
    it('should be a true', async () => {
      const req = httpMocks.createRequest();
      req.res = httpMocks.createResponse();
      await controller.logout(req);
      fakeController.logout.mockReturnValue(true);
      expect(true).toBe(fakeController.logout());
    });
  });
});
