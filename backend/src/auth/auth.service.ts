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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerEmail(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          passwordHash: hashedPassword,
        },
      });

      // get supported currencies
      const currencies = await this.prisma.currency.findMany();

      // create wallets for each currency
      await this.prisma.wallet.createMany({
        data: currencies.map((currency) => ({
          userId: user.id,
          currencyId: currency.id,
          balance: 0,
        })),
      });

      return {
        message: 'User registered successfully',
        userId: user.id,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email or Username already exists');
      }

      throw new InternalServerErrorException();
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

    // send SMS here normally
    console.log(`OTP for ${phone}: ${code}`);

    return {
      message: 'OTP sent',
    };
  }

  async verifyOtp(phone: string, currencyId: string) {
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

    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          username: `user_${Date.now()}`,

          wallets: {
            create: {
              balance: new Prisma.Decimal(0),
              currencyId,
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

  async googleLogin(googleUser: any, currencyId: string) {
    let provider = await this.prisma.authProvider.findFirst({
      where: {
        provider: 'google',
        providerId: googleUser.id,
      },
      include: {
        user: true,
      },
    });

    if (!provider) {
      const user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          username: googleUser.email.split('@')[0],

          wallets: {
            create: {
              balance: new Prisma.Decimal(0),
              currencyId,
            },
          },
        },
      });

      await this.prisma.authProvider.create({
        data: {
          provider: 'google',
          providerId: googleUser.id,
          userId: user.id,
        },
      });

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

    const payload = {
      sub: provider.user.id,
      email: provider.user.email,
      role: provider.user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
