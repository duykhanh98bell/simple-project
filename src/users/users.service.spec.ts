import { MailerModule } from '@nestjs-modules/mailer';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import TestUser from './test/TestUser';
import { UsersService } from './users.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  const fakeUser = {
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: fakeUser,
        },
      ],
      imports: [
        MailerModule.forRoot({
          transport: {
            service: 'gmail',
            auth: {
              user: process.env.MAIL_ID,
              pass: process.env.MAIL_PASS,
            },
          },
          defaults: {
            from: '"nest-modules" <modules@nestjs.com>',
          },
          template: {
            dir: process.cwd() + '/templates/',
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        }),
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find users', () => {
    it('should be array users', async () => {
      const user = TestUser.giveAValidUser();
      fakeUser.find.mockReturnValue([user, user]);
      const users = await service.read();
      expect(users).toHaveLength(2);
    });
  });

  describe('check username', () => {
    it('should be a user', async () => {
      const user = {
        loginfirst: false,
        username: 'khanhdd',
        email: 'khanhddd@newwave.vn',
        role: 'admin',
        password: '123456',
      };
      fakeUser.findOne.mockReturnValue(BadRequestException);
      await service.checkUsername(user.username).catch((e) => {
        expect(e).toBeInstanceOf(fakeUser.findOne());
      });
    });
  });
  describe('check email', () => {
    it('should be a user', async () => {
      const user = {
        loginfirst: false,
        username: 'khanhddd',
        email: 'khanhdd@newwave.vn',
        role: 'admin',
        password: '123456',
      };
      fakeUser.findOne.mockReturnValue(BadRequestException);
      await service.checkEmail(user.email).catch((e) => {
        expect(e).toBeInstanceOf(fakeUser.findOne());
      });
    });
  });
  describe('create user', () => {
    it('should be a user', async () => {
      const user = {
        loginfirst: false,
        username: 'khanhddd',
        email: 'khanhddd@newwave.vn',
        role: 'admin',
        password: '123456',
      };

      fakeUser.create.mockReturnValue(user);
      const saveUser = await service.create(user);
      expect(fakeUser.create()).toBe(saveUser);
    });
  });

  describe('remove user', () => {
    it('should return user deleted', async () => {
      const user = {
        loginfirst: false,
        _id: '601a6c7871dac540b8d4828e',
        username: 'khanhdd',
        email: 'khanhdd@newwave.vn',
        role: 'admin',
        password:
          '$2b$12$5sNpr5PrpO9A/OTgC8uUSu8Hrvn746.ft7oHqT1zTEmCoMS6PdMTi',
        __v: 0,
      };
      fakeUser.findByIdAndDelete.mockReturnValue(user);
      expect(await service.remove('600a477bbabaf24ac8564d47')).toMatchObject(
        user,
      );
    });
  });
});
