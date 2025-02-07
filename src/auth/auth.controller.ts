import { Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // authorization: Basic $token
  async registerUser(@Headers('authorization') token: string) { // -> authorization라는 키값의 헤더를 받을거다. 
    return await this.authService.register(token);
  }
}
