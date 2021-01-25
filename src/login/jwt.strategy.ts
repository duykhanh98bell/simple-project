/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { createBlackList } from 'jwt-blacklist';
import { blacklist } from './blacklist';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    if (blacklist.array.length > 0) {
      blacklist.array.forEach((token) => {
        const check = payload.iat + '-' + payload.exp;
        if (token === check) {
          throw console.error();
        }
      });
      if (blacklist.array.length === 10000) {
        blacklist.array = [];
      }
    }
    return { ...payload.user };
  }
}
