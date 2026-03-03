import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Dashboard summary statistics
   */
  async getSummary() {
    const [
      totalUsers,
      totalBets,
      deposits,
      withdrawals,
      betAmount,
      payoutAmount,
    ] = await Promise.all([
      this.prisma.user.count(),

      this.prisma.bet.count(),

      this.prisma.deposit.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { amount: true },
      }),

      this.prisma.withdrawal.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),

      this.prisma.bet.aggregate({
        _sum: { amount: true },
      }),

      this.prisma.bet.aggregate({
        _sum: { payout: true },
      }),
    ]);

    const totalDeposits = deposits._sum.amount ?? new Prisma.Decimal(0);
    const totalWithdrawals = withdrawals._sum.amount ?? new Prisma.Decimal(0);

    const totalBetAmount = betAmount._sum.amount ?? new Prisma.Decimal(0);
    const totalPayoutAmount = payoutAmount._sum.payout ?? new Prisma.Decimal(0);

    const houseProfit = totalDeposits.minus(totalWithdrawals);

    const rtp = totalBetAmount.equals(0)
      ? 0
      : totalPayoutAmount.div(totalBetAmount).mul(100);

    return {
      totalUsers,
      totalBets,

      totalDeposits: totalDeposits.toNumber(),
      totalWithdrawals: totalWithdrawals.toNumber(),

      houseProfit: houseProfit.toNumber(),

      rtp: Number(rtp.toFixed(2)), // return to player %
    };
  }

  /**
   * Recent transactions (ledger history)
   */
  async getRecentTransactions() {
    return this.prisma.ledger.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        amount: true,
        balanceAfter: true,
        type: true,
        createdAt: true,

        wallet: {
          select: {
            user: {
              select: {
                username: true,
              },
            },

            currency: {
              select: {
                symbol: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Recent bets
   */
  async getRecentBets() {
    return this.prisma.bet.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        amount: true,
        payout: true,
        status: true,
        createdAt: true,

        user: {
          select: {
            username: true,
          },
        },

        game: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  /**
   * Daily deposits chart
   */
  async getDailyDeposits() {
    return this.prisma.deposit.groupBy({
      by: ['createdAt'],
      where: {
        status: 'CONFIRMED',
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Daily bets chart
   */
  async getDailyBets() {
    return this.prisma.bet.groupBy({
      by: ['createdAt'],
      _sum: {
        amount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Financial statistics for today
   */
  async getTodayStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      todayDeposits,
      todayWithdrawals,
      todayBets,
      todayPayouts,
      activeUsers,
    ] = await Promise.all([
      this.prisma.deposit.aggregate({
        where: {
          status: 'CONFIRMED',
          createdAt: { gte: todayStart },
        },
        _sum: { amount: true },
      }),

      this.prisma.withdrawal.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: todayStart },
        },
        _sum: { amount: true },
      }),

      this.prisma.bet.aggregate({
        where: {
          createdAt: { gte: todayStart },
        },
        _sum: { amount: true },
      }),

      this.prisma.bet.aggregate({
        where: {
          createdAt: { gte: todayStart },
        },
        _sum: { payout: true },
      }),

      this.prisma.bet.groupBy({
        by: ['userId'],
        where: {
          createdAt: { gte: todayStart },
        },
      }),
    ]);

    const deposits = todayDeposits._sum.amount ?? new Prisma.Decimal(0);
    const withdrawals = todayWithdrawals._sum.amount ?? new Prisma.Decimal(0);
    const bets = todayBets._sum.amount ?? new Prisma.Decimal(0);
    const payouts = todayPayouts._sum.payout ?? new Prisma.Decimal(0);

    const profit = bets.minus(payouts);

    return {
      todayDeposits: deposits.toNumber(),
      todayWithdrawals: withdrawals.toNumber(),
      todayBets: bets.toNumber(),
      todayPayouts: payouts.toNumber(),
      todayProfit: profit.toNumber(),
      activeUsers: activeUsers.length,
    };
  }
}
