// import { getModelToken } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
// import { LoginService } from './login.service';

// describe('LoginService', () => {
//   let service: LoginService;
//   const fakeLogin = {
//     login: jest.fn(),
//     change: jest.fn(),
//     logout: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         LoginService,
//         {
//           provide: getModelToken('User'),
//           useValue: fakeLogin,
//         },
//       ],
//     }).compile();

//     service = module.get<LoginService>(LoginService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
