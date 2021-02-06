import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoginDto } from 'src/login/dto/login.dto';
import { CreateDepartmentDto } from 'src/department/dto/create-department.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});
describe('AUTH (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST) Should Login', () => {
    const user: LoginDto = {
      username: 'duykhanh98',
      password: '123456',
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .expect(200)
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.access_token).toBeDefined();
        expect(body.user.username).toEqual('duykhanh98');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
// describe('DEPARTMENT (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET) Department', () => {
//     return request(app.getHttpServer()).post('/department').expect(200);
//   });
//   it('/ (POST) Department', () => {
//     const department: CreateDepartmentDto = {
//       name: 'Manager',
//       officephone: '0999999999',
//       manager: 'duytq',
//     };
//     return request(app.getHttpServer())
//       .post('/department')
//       .expect(201)
//       .set('Accept', 'application/json')
//       .send(department)
//       .expect(({ body }) => {
//         expect(body.name).toBeDefined();
//         expect(body.officephone).toBeDefined();
//         expect(body.manager).toBeDefined();
//         expect(body.name).toEqual('name');
//         expect(body.officephone).toEqual('0999999999');
//         expect(body.manager).toEqual('duytq');
//       });
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
