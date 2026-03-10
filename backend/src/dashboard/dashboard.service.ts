import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/** Safely convert Prisma Decimal or number to number for JSON. */
function toNumber(value: unknown): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const d = value as { toNumber?: () => number } | null | undefined;
  if (d != null && typeof d.toNumber === 'function') return d.toNumber();
  return 0;
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

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
   * Recent transactions (ledger history).
   * Returns plain JSON-serializable objects (no Prisma Decimal/Date).
   */
  async getRecentTransactions() {
    try {
      const rows = await this.prisma.ledger.findMany({
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
      return rows.map((row) => {
        const wallet = row.wallet;
        return {
          id: String(row.id),
          amount: toNumber(row.amount),
          balanceAfter: toNumber(row.balanceAfter),
          type: String(row.type),
          createdAt: row.createdAt.toISOString(),
          wallet: wallet
            ? {
                user: wallet.user
                  ? { username: String(wallet.user.username) }
                  : null,
                currency: wallet.currency
                  ? {
                      symbol: String(wallet.currency.symbol),
                      name: String(wallet.currency.name),
                    }
                  : null,
              }
            : null,
        };
      });
    } catch (err) {
      this.logger.error('getRecentTransactions failed', err);
      throw err;
    }
  }

  /**
   * Recent bets.
   * Converts Prisma Decimal fields to numbers for JSON serialization.
   */
  async getRecentBets() {
    const rows = await this.prisma.bet.findMany({
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
    return rows.map((row) => ({
      id: row.id,
      amount: toNumber(row.amount),
      payout: toNumber(row.payout),
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      user: row.user ? { username: row.user.username } : null,
      game: row.game ? { name: row.game.name } : null,
    }));
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
