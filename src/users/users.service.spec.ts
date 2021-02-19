import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import TestUser from './test/TestUser';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const fakeUser = {
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
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
});
