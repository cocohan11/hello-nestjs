import { Controller, Post, Headers, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // authorization: Basic $token
  async registerUser(@Headers('authorization') token: string) { // -> authorization라는 키값의 헤더를 받을거다. 
    return await this.authService.register(token);
  }

  @Post('login')
  loginUser(@Headers('authorization') token: string){
    return this.authService.logoin(token);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login/passport')
  loginUserPassport(@Request() req) {
    return req.user;
  }
}
