import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Email register
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerEmail(dto);
  }

  // Email login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.loginEmail(dto);
  }

  // Send OTP
  @Post('send-otp')
  async sendOtp(@Body('phone') phone: string) {
    return this.authService.sendOtp(phone);
  }

  // Verify OTP
  @Post('verify-otp')
  async verifyOtp(
    @Body('phone') phone: string,
    @Body('currencyId') currencyId: string,
  ) {
    return this.authService.verifyOtp(phone, currencyId);
  }

}