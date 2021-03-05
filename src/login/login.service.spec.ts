import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { request, response } from 'express';
import { LoginService } from './login.service';
import { tokenTest } from './test/tokenTest';

describe('LoginService', () => {
  let service: LoginService;
  const fakeLogin = {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    logout: jest.fn(),
    compare: jest.fn(),
    comparePassword: jest.fn(),
    sign: jest.fn(),
    hash: jest.fn(),
    header: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule.register({
          secret: process.env.TOKEN_SECRET,
          signOptions: { expiresIn: '900s' },
        }),
      ],
      providers: [
        LoginService,
        {
          provide: getModelToken('User'),
          useValue: fakeLogin,
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should be a token', async () => {
      const data = {
        username: 'duykhanh98',
        password: '123456',
      };
      const user = {
        loginfirst: true,
        _id: '6009062e53c4c9948c62f93b',
        username: 'duykhanh98',
        password:
          '$2b$12$/5e1hBxSP5R8Kdc.grxfb.gf9sq77lzoGiNpV4Mk5tW2wrCCYnIQ6',
        email: 'duykhanh98bell@gmail.com',
        role: 'admin',
      };
      fakeLogin.findOne.mockReturnValue(user);
      fakeLogin.compare.mockReturnValue(true);
      const tokenObj = await service.login(data);
      // const data = await (await service.findUser('duykhanh98'))
      expect(tokenObj).toBe(tokenTest.access_token);
    });
    it('exist username', async () => {
      const data = {
        username: 'duykhanh988',
        password: '123456',
      };

      fakeLogin.findOne.mockReturnValue(null);
      await service.login(data).catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException);
      });
    });
    it('check password', async () => {
      const data = {
        username: 'duykhanh98',
        password: '1234567',
      };
      const user = {
        loginfirst: true,
        _id: '6009062e53c4c9948c62f93b',
        username: 'duykhanh98',
        password:
          '$2b$12$/5e1hBxSP5R8Kdc.grxfb.gf9sq77lzoGiNpV4Mk5tW2wrCCYnIQ6',
        email: 'duykhanh98bell@gmail.com',
        role: 'admin',
      };
      fakeLogin.findOne.mockReturnValue(user);
      fakeLogin.comparePassword.mockReturnValue(false);
      await service.login(data).catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException);
      });
    });
  });

  describe('change', () => {
    it('should be a message ok', async () => {
      const data = {
        password: '123456',
        newpassword: '123444',
        repassword: '123444',
      };
      const user = {
        loginfirst: true,
        _id: '6009062e53c4c9948c62f93b',
        username: 'duykhanh98',
        password:
          '$2b$12$/5e1hBxSP5R8Kdc.grxfb.gf9sq77lzoGiNpV4Mk5tW2wrCCYnIQ6',
        email: 'duykhanh98bell@gmail.com',
        role: 'admin',
      };
      await service.change(data, user);
    });

    it('should be badrequest', async () => {
      const data = {
        password: '123456',
        newpassword: '123445',
        repassword: '123444',
      };
      const user = {
        loginfirst: true,
        _id: '6009062e53c4c9948c62f93b',
        username: 'duykhanh98',
        password:
          '$2b$12$/5e1hBxSP5R8Kdc.grxfb.gf9sq77lzoGiNpV4Mk5tW2wrCCYnIQ6',
        email: 'duykhanh98bell@gmail.com',
        role: 'admin',
      };
      await service.change(data, user).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
      });
    });

    it('should be badrequest', async () => {
      const data = {
        password: '123457',
        newpassword: '123444',
        repassword: '123444',
      };
      const user = {
        loginfirst: true,
        _id: '6009062e53c4c9948c62f93b',
        username: 'duykhanh98',
        password:
          '$2b$12$/5e1hBxSP5R8Kdc.grxfb.gf9sq77lzoGiNpV4Mk5tW2wrCCYnIQ6',
        email: 'duykhanh98bell@gmail.com',
        role: 'admin',
      };
      await service.change(data, user).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('logout', () => {
    it('should be a ok', async () => {
      const token = tokenTest.access_token;
      fakeLogin.logout.mockReturnValue(true);
      const log = await service.logout(token);
      expect(fakeLogin.logout()).toBe(log);
    });
  });
});
