import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { ChangePass } from './dto/change-pass.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    const access_token = await this.loginService.login(loginDto);
    const first = await this.loginService.findUser(loginDto.username);

    return res.json({ access_token, first: first.loginfirst });
  }

  @UseGuards(JwtAuthGuard)
  @Put('change')
  async changePass(
    @Body() changePass: ChangePass,
    @Req() req: any,
    @Res() res: any,
  ) {
    const user = await req.user;
    const first = await this.loginService.change(changePass, user);
    return res.json({
      first,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Req() req: any) {
    const tokenPush = req.headers['Authorization'].slice(7);
    return await this.loginService.logout(tokenPush);
  }
}
