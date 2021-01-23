import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePass } from './dto/change-pass.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: any, @Res() res: any) {
    return await this.loginService.login(loginDto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change')
  async changePass(
    @Body() changePass: ChangePass,
    @Req() req: any,
    @Res() res: any,
  ) {
    return await this.loginService.change(changePass, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Req() req: any, @Res() res: any) {
    return await this.loginService.logout(req, res);
  }
}
