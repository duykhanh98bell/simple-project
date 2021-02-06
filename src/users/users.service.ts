/* eslint-disable @typescript-eslint/no-var-requires */
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
const randomstring = require('randomstring');
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  public example(passRandom: string, email: string): void {
    this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        from: process.env.MAIL_ID, // Senders email address
        subject: 'Đăng nhập lần đầu đi bạn', // Subject line
        text: 'welcome', // plaintext body
        html: `<b>Password first login : ${passRandom}<b>`, // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async create(createUserDto: CreateUserDto) {
    const [checkUser, checkEmail] = await Promise.all([
      this.UserModel.find({
        username: createUserDto.username,
      }),
      this.UserModel.find({
        email: createUserDto.email,
      }),
    ]);

    if (checkUser.length > 0)
      throw new HttpException('Username is exist', HttpStatus.BAD_REQUEST);

    if (checkEmail.length > 0)
      throw new HttpException('Email is exist', HttpStatus.BAD_REQUEST);

    const passRandom: string = await randomstring.generate(7);
    await this.example(passRandom, createUserDto.email);
    const hasedPass = await bcrypt.hash(passRandom, 12);
    createUserDto.password = hasedPass;
    const createNew = await this.UserModel.create(createUserDto);
    return {
      message: 'Tao Tai khoan thanh cong',
      createNew,
    };
  }

  async read(): Promise<UserDocument[]> {
    return this.UserModel.find();
  }

  async remove(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }
}
