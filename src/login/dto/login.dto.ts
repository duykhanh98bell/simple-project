/* eslint-disable prettier/prettier */
import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
  @Length(6, 18, { message: 'Tên tài khoản từ 6 - 18 kí tự' })
  username: string;

  @IsNotEmpty({ message: 'Mật khẩu không đươc trống' })
  password: string;
}
