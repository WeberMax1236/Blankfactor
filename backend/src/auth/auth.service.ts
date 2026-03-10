import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
// import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async generateReferralCode(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    while (true) {
      let code = '';

      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }

      const existing = await this.prisma.user.findUnique({
        where: { referralCode: code },
      });

      if (!existing) return code;
    }
  }
  async registerEmail(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let referrerId: string | null = null;

    if (dto.referralCode) {
      const referrer = await this.prisma.user.findUnique({
        where: { referralCode: dto.referralCode },
      });

      if (referrer) {
        referrerId = referrer.id;
      }
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          passwordHash: hashedPassword,
          referralCode: await this.generateReferralCode(),
          referrerId,
        },
      });

      // create wallets for all currencies

      const currencies = await this.prisma.currency.findMany();

      await this.prisma.wallet.createMany({
        data: currencies.map((c) => ({
          userId: user.id,
          currencyId: c.id,
          balance: new Prisma.Decimal(0),
        })),
      });

      return {
        message: 'User registered successfully',
        userId: user.id,
        referralCode: user.referralCode,
      };
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err?.code === 'P2002') {
        throw new ConflictException('Email or Username already exists');
      }
      const message = err?.message ?? String(error);
      if (process.env.NODE_ENV !== 'production') {
        console.error('[AuthService] register error:', message, error);
      }
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'production' ? undefined : message,
      );
    }
  }
  async loginEmail(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async sendOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const codeHash = await bcrypt.hash(code, 10);

    await this.prisma.otpCode.create({
      data: {
        phone,
        codeHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`OTP for ${phone}: ${code}`);

    return {
      message: 'OTP sent',
    };
  }
  async verifyOtp(dto: VerifyOtpDto) {
    const { phone, code, currencyId } = dto;

    const otp = await this.prisma.otpCode.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new UnauthorizedException('OTP not found');
    }

    if (otp.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }

    const valid = await bcrypt.compare(code, otp.codeHash);

    if (!valid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // find user
    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    // create user if not exist
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          username: `user_${Date.now()}`,
          referralCode: await this.generateReferralCode(),

          wallets: {
            create: {
              currencyId,
              balance: new Prisma.Decimal(0),
            },
          },
        },
      });
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async googleLogin(idToken: string, currencyId: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const googleId = payload.sub;
    const email = payload.email;

    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }
    
    let provider = await this.prisma.authProvider.findFirst({
      where: {
        provider: 'google',
        providerId: googleId,
      },
      include: { user: true },
    });

    if (!provider) {
      const user = await this.prisma.user.create({
        data: {
          email,
          username: email.split('@')[0],
          referralCode: await this.generateReferralCode(),

          wallets: {
            create: {
              currencyId,
              balance: new Prisma.Decimal(0),
            },
          },
        },
      });

      await this.prisma.authProvider.create({
        data: {
          provider: 'google',
          providerId: googleId,
          userId: user.id,
        },
      });

      const token = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return { access_token: token };
    }

    const token = await this.jwtService.signAsync({
      sub: provider.user.id,
      email: provider.user.email,
      role: provider.user.role,
    });

    return { access_token: token };
  }
}
