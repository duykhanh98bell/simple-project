// import { CanActivate } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { LoginDto } from './dto/login.dto';
// import { LoginController } from './login.controller';
// import { LoginService } from './login.service';

// describe('LoginController', () => {
//   let loginController: LoginController;

//   beforeEach(async () => {
//     // const mock_ForceFailGuard: CanActivate = {
//     //   canActivate: jest.fn(() => true),
//     // };

//     const app: TestingModule = await Test.createTestingModule({
//       controllers: [LoginController],
//       providers: [LoginService],
//     })
//       // .overrideGuard(ForceFailGuard)
//       // .useValue(mock_ForceFailGuard)
//       .compile();

//     loginController = app.get<LoginController>(LoginController);
//   });

//   describe('root', () => {
//     it('should return token', () => {
//       const user: LoginDto = {
//         username: 'duykhanh98',
//         password: '123456',
//       };
//       expect(loginController.login).toBe('Hello World!');
//     });
//   });
// });
