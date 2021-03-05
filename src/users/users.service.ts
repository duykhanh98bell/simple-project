/* eslint-disable @typescript-eslint/no-var-requires */
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
    this.mailerService.sendMail({
      to: email, // List of receivers email address
      from: process.env.MAIL_ID, // Senders email address
      subject: 'Đăng nhập lần đầu đi bạn', // Subject line
      text: 'welcome', // plaintext body
      html: `<b>Password first login : ${passRandom}<b>`, // HTML body content
    });
  }

  async create(createUserDto: CreateUserDto) {
    const passRandom: string = await randomstring.generate(7);
    this.example(passRandom, createUserDto.email);
    const hasedPass = await bcrypt.hash(passRandom, 12);
    createUserDto.password = hasedPass;
    return await this.UserModel.create(createUserDto);
  }
  async checkUsername(username: string) {
    return await this.UserModel.findOne({
      username: username,
    });
  }
  async checkEmail(email: string) {
    return await this.UserModel.findOne({
      email: email,
    });
  }

  async read(): Promise<UserDocument[]> {
    return await this.UserModel.find();
  }

  async remove(id: string) {
    return await this.UserModel.findByIdAndDelete(id);
  }
}
