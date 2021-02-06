/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
const jwt = require('jsonwebtoken');

@Injectable()
export class LoginService {
  constructor(
    @InjectModel('User') private UserModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto, req: any, res: any) {
    const user = await this.UserModel.findOne({ username: loginDto.username });
    if (!user)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    const access_token = await this.jwtService.sign({ user: user });

    if (user.loginfirst === true) {
      return res.status(200).json({
        message: 'Đăng nhập thành công',
        user,
        access_token,
      });
    } else {
      return res.status(202).json({
        message: `Connect PUT ${process.env.HOST}/auth/change change password`,
        access_token,
      });
    }
  }

  async change(changePass: ChangePass, req: any, res: any) {
    const user = await req.user;
    if (changePass.newpassword != changePass.repassword)
      return res.status(400).json({ message: 'Mật khẩu không trùng khớp' });
    const match = await bcrypt.compare(changePass.password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Mật khẩu không chính xác' });
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
    return res.status(200).json({ message: 'Thay đổi mật khẩu thành công' });
  }

  async logout(req: any, res: any) {
    const tokenPush = req.header('Authorization').slice(7);
    if (tokenPush) {
      const token = jwt.verify(tokenPush, process.env.TOKEN_SECRET);
      blacklist.array.push(token.iat + '-' + token.exp);
    }
    res.sendStatus(200);
  }
}
