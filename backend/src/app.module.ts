import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './common/common.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuditModule } from './modules/audit/audit.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { BetsModule } from './modules/bets/bets.module';
import { GamesModule } from './modules/games/games.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { AuditModule } from './modules/audit/audit.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { GamesModule } from './modules/games/games.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { BetsModule } from './modules/bets/bets.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, WalletModule, BetsModule, PaymentsModule, AdminModule, AuthModule, GamesModule, LedgerModule, AuditModule, RateLimitModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
