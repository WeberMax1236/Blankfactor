import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { BetsModule } from './bets/bets.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FairnessService } from './fairness/fairness.service';
import { FairnessModule } from './fairness/fairness.module';

@Module({
  imports: [

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 20,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    CommonModule,
    UsersModule,
    WalletModule,
    BetsModule,
    GamesModule,
    AuthModule,
    TransactionsModule,
    AdminModule,
    DashboardModule,
    FairnessModule,
  ],
  controllers: [AppController],
  providers: [AppService, FairnessService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}