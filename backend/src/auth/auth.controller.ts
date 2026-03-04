import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user using email & password
   */
  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.registerEmail(dto);
  }

  /**
   *
   * SendOtp and VerifyOtp for phone number authentication. This is a two-step process:
   * 1. Client calls /auth/send-otp with phone number. Server generates OTP, stores it temporarily, and sends it to the phone.
   * 2. Client calls /auth/verify-otp with phone number and OTP. Server verifies the OTP and logs in the user if valid.
   */
  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }
  /**
   * Login user and return JWT token
   */
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  @ApiResponse({
    status: 200,
    description: 'JWT token returned',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.loginEmail(dto);
  }

  @Post('google')
  async googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto.idToken, dto.currencyId)
  }
}
