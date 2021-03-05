/* eslint-disable @typescript-eslint/no-var-requires */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/entities/user.entity';
import { ChangePass } from './dto/change-pass.dto';
import { LoginDto } from './dto/login.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import { createBlackList } from 'jwt-blacklist';
import { blacklist } from './blacklist';
import { tokenTest } from './test/tokenTest';
const jwt = require('jsonwebtoken');

@Injectable()
export class LoginService {
  constructor(
    @InjectModel('User') private UserModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.findUser(loginDto.username);
    if (!user) throw new NotFoundException('invalid user');

    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match) throw new NotFoundException('Invalid credentials');

    const access_token = await this.jwtService.sign({ user: user });
    tokenTest.access_token = access_token;
    return access_token;
  }

  async findUser(name: string) {
    return await this.UserModel.findOne({ username: name });
  }

  async change(changePass: ChangePass, user: any) {
    if (changePass.newpassword != changePass.repassword)
      throw new BadRequestException('Mật khẩu không trùng khớp');
    const match = await bcrypt.compare(changePass.password, user.password);
    if (!match) throw new BadRequestException('Mật khẩu không chính xác');
    const hashedPass = await bcrypt.hash(changePass.newpassword, 12);
    await this.UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          password: hashedPass,
          loginfirst: true,
        },
      },
      { new: true },
    );
    return true;
  }

  async logout(tokenPush: string) {
    if (tokenPush) {
      const token = jwt.verify(tokenPush, process.env.TOKEN_SECRET);
      blacklist.array.push(token.iat + '-' + token.exp);
    }
    return true;
  }
}
