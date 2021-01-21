/* eslint-disable prettier/prettier */
import { IsNotEmpty, Length } from 'class-validator';

export class ChangePass {
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Length(6, 18, { message: 'Mật khẩu từ 6 - 18 kí tự' })
  password: string;

  @IsNotEmpty({ message: 'Không được để trống' })
  @Length(6, 18, { message: 'Mật khẩu từ 6 - 18 kí tự' })
  newpassword: string;

  @IsNotEmpty({ message: 'Không được để trống' })
  @Length(6, 18, { message: 'Mật khẩu từ 6 - 18 kí tự' })
  repassword: string;
}
