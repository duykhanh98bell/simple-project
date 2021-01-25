<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Database

- employees:

* name: Tên nhân viên.
* jobtitle: Vị trí.
* cellphone: Số điện thoại.
* email: email.
* department_id: Khóa ngoại ref: department.
* photo: avatar nhân viên.

- departments:

* name: Tên phòng ban.
* officephone: Số điện thoại.
* manager: Tên trưởng phòng.

- users:

* username: Tên tài khoản admin.
* password: Mật khẩu.
* email: Email.
* role: quyền,
* loginfisrt: true(đã đăng nhập lần đầu) false(Chưa đăng nhập lần đầu)

## Tạo tài khoản: Authorization

POST http://localhost:3000/users

{
"username": "duykhanh98",
"email": "duykhanh98bell@gmail.com",
"role": "admin"
}
Mật khẩu sẽ được gửi vào email

## Đổi mật khẩu: Authorization

PUT http://localhost:3000/auth/change

- password: Mật khẩu được gửi qua email
- newpassword: Mật khẩu mới
- repassword: Xác nhận mật khẩu vừa nhập
  {
  "password": "L308dPl",
  "newpassword": "123456",
  "repassword": "123456"
  }

## Đăng nhập:

POST http://localhost:3000/auth/login

{
"username": "hoangha2004",
"password": "123456"
}

## Đăng xuất Authorization

DELETE http://localhost:3000/auth/logout

## Tạo phòng ban: Authorization

POST http://localhost:3000/department

{
"name": "PM",
"officephone": "0987654321",
"manager": "trungnt"
}

## Danh sách tất cả phòng ban: Authorization

GET http://localhost:3000/department

## Xem chi tiết phòng ban: Authorization

GET http://localhost:3000/department/:id

## Sửa phòng ban: Authorization

PUT http://localhost:3000/department/:id
{
"name": "Develop",
"officephone": "0336378689",
"manager": "khanhdd"
}

## Xóa phòng ban: Authorization

DELETE http://localhost:3000/department/:id

## Tạo mới nhân viên: Authorization

POST http://localhost:3000/employee

- name: Tên nhân viên,
- photo: file,
- jobtitle:
- cellphone:
- email:
- department_id: id phòng ban

## Danh sách nhân viên: Authorization

GET http://localhost:3000/employee

## Xem chi tiết nhân viên: Authorization

GET http://localhost:3000/employee/:id

## Sửa nhân viên: Authorization

PUT http://localhost:3000/employee/:id

- name: Tên nhân viên,
- photo: file (Có thể thay hoặc không)
- jobtitle:
- cellphone:
- email:
- department_id: id phòng ban

## Xóa nhân viên: Authorization

DELETE http://localhost:3000/employee/:id

## Xem phòng ban có những nhân viên nào: Authorization

GET http://localhost:3000/department/employeein/:id phòng ban
