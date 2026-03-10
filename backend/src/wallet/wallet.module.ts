import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
