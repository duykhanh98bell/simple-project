/* eslint-disable prettier/prettier */
import { User } from '../entities/user.entity';

export default class TestUser {
  static giveAValidUser(): User {
    const user = new User();
    user.email = 'duykhanh98bell@gmail.com';
    user.loginfirst = true;
    user.password =
      '$2b$12$/5e1hBxSP5R8Kdc.grxfb.gf9sq77lzoGiNpV4Mk5tW2wrCCYnIQ6';
    user.role = 'admin';
    user.username = 'duykhanh98';
    return user;
  }
}
