import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get wallet by user + currency
   */
  async getWallet(userId: string, currencyId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId_currencyId: {
          userId,
          currencyId,
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  /**
   * Get wallet balance (cached balance)
   */
  async getBalance(walletId: string, userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
      select: { balance: true, userId: true },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    if (wallet.userId !== userId) {
      throw new NotFoundException('Wallet is not yours');
    }
    return wallet.balance;
  }

  /**
   * Calculate available balance
   *
   * available = balance - locked funds
   */
  async getAvailableBalance(walletId: string, userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
      select: { balance: true, userId: true },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    if (wallet.userId !== userId) {
      throw new NotFoundException('Wallet is not yours');
    }

    const locked = await this.prisma.balanceLock.aggregate({
      where: {
        walletId,
        released: false,
      },
      _sum: {
        amount: true,
      },
    });

    const lockedAmount = locked._sum.amount || new Prisma.Decimal(0);

    return wallet.balance.minus(lockedAmount);
  }

  /**
   * Create ledger entry
   *
   * Ledger is immutable financial history.
   */
  async createLedgerEntry(
    tx: Prisma.TransactionClient,
    walletId: string,
    amount: Prisma.Decimal,
    type: any,
    reference?: string,
  ) {
    const wallet = await tx.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const newBalance = wallet.balance.plus(amount);

    const ledger = await tx.ledger.create({
      data: {
        walletId,
        amount,
        balanceAfter: newBalance,
        type,
        reference,
      },
    });

    await tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: newBalance,
      },
    });

    return ledger;
  }

  /**
   * Create deposit record
   *
   * This is called when user sends crypto to platform address.
   * Status = PENDING until blockchain confirmations arrive.
   */
  async createDeposit(
    walletId: string,
    amount: number,
    txHash: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const deposit = await this.prisma.deposit.create({
      data: {
        walletId,
        amount,
        txHash,
        confirmations: 0,
        status: 'PENDING',
      },
    });

    return deposit;
  }
  /**
   * Confirm deposit and credit wallet
   */
  async confirmDeposit(depositId: string) {
    return this.prisma.$transaction(async (tx) => {
      const deposit = await tx.deposit.findUnique({
        where: { id: depositId },
      });

      if (!deposit) {
        throw new Error('Deposit not found');
      }

      if (deposit.status === 'CONFIRMED') {
        throw new Error('Deposit already processed');
      }

      await tx.deposit.update({
        where: { id: depositId },
        data: { status: 'CONFIRMED' },
      });

      await this.createLedgerEntry(
        tx,
        deposit.walletId,
        deposit.amount,
        'DEPOSIT',
        deposit.txHash,
      );
    });
  }

  /**
   * Create withdrawal request
   */
  async requestWithdrawal(
    userId: string,
    walletId: string,
    amount: number,
    address: string,
  ) {
    const available = await this.getAvailableBalance(walletId, userId);

    if (available.lessThan(amount)) {
      throw new Error('Insufficient balance');
    }

    return this.prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.create({
        data: {
          walletId,
          amount,
          address,
          status: 'PENDING',
        },
      });

      // lock funds
      await tx.balanceLock.create({
        data: {
          walletId,
          amount,
          reason: 'WITHDRAWAL',
          referenceId: withdrawal.id,
        },
      });

      return withdrawal;
    });
  }

  /**
   * Place bet
   */
  async placeBet(
    userId: string,
    walletId: string,
    gameId: string,
    amount: number,
    clientSeed: string,
  ) {
    const available = await this.getAvailableBalance(walletId, userId);

    if (available.lessThan(amount)) {
      throw new Error('Insufficient balance');
    }

    return this.prisma.$transaction(async (tx) => {
      const bet = await tx.bet.create({
        data: {
          userId,
          walletId,
          gameId,
          amount,
          clientSeed,
          nonce: 0,
          status: 'PENDING',
        },
      });

      await tx.balanceLock.create({
        data: {
          walletId,
          amount,
          reason: 'BET',
          referenceId: bet.id,
        },
      });

      return bet;
    });
  }

  /**
   * Settle bet result
   */
  async settleBet(
    betId: string,
    payout: Prisma.Decimal,
    status: 'WON' | 'LOST',
  ) {
    return this.prisma.$transaction(async (tx) => {
      const bet = await tx.bet.findUnique({
        where: { id: betId },
      });

      if (!bet) {
        throw new Error('Bet not found');
      }

      await tx.bet.update({
        where: { id: betId },
        data: {
          status,
          payout,
        },
      });

      // release lock
      await tx.balanceLock.updateMany({
        where: {
          referenceId: betId,
          reason: 'BET',
        },
        data: {
          released: true,
        },
      });

      if (status === 'WON') {
        await this.createLedgerEntry(tx, bet.walletId, payout, 'WIN', betId);
      }
    });
  }

  /**
   * Get wallet transaction history
   *
   * Returns ledger records ordered by newest first.
   */
  async getTransactions(walletId: string) {
    return this.prisma.ledger.findMany({
      where: {
        walletId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
  }
}
