/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/entities/user.entity';
import { ChangePass } from './dto/change-pass.dto';
import { LoginDto } from './dto/login.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import { createBlackList } from 'jwt-blacklist';
import { blacklist } from './blacklist';
const jwt = require('jsonwebtoken');

@Injectable()
export class LoginService {
  constructor(
    @InjectModel('User') private UserModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto, req: any, res: any) {
    const user = await this.UserModel.findOne({ username: loginDto.username });
    if (!user) return res.json({ message: 'Username not exist' });
    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match) return res.json({ message: 'password fail' });
    const access_token = await this.jwtService.sign({ user: user });
    if (access_token) {
      req.session.tok = access_token;
    }
    if (user.loginfirst === true) {
      return res.json({
        message: 'Đăng nhập thành công',
        access_token,
      });
    } else {
      return res.json({
        message: `Connect PUT ${process.env.HOST}/auth/change change password`,
        access_token,
      });
    }
  }

  async change(changePass: ChangePass, req: any, res: any) {
    const user = await req.user;
    if (changePass.newpassword != changePass.repassword)
      return res.json({ message: 'Mật khẩu không trùng khớp' });
    const match = await bcrypt.compare(changePass.password, user.password);
    if (!match) return res.json({ message: 'Mật khẩu không chính xác' });
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
    return res.json({ message: 'Thay đổi mật khẩu thành công' });
  }

  async logout(req: any, res: any) {
    if (req.session.tok) {
      const token = jwt.verify(req.session.tok, process.env.TOKEN_SECRET);
      blacklist.array.push(token.iat + '-' + token.exp);
    }
    res.sendStatus(200);
  }
}
