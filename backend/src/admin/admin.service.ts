import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all users
   */
  async getUsers() {
    return this.prisma.user.findMany({
      take: 50,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get pending withdrawals
   */
  async getWithdrawals() {
    return this.prisma.withdrawal.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        wallet: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Approve withdrawal
   */
  async approveWithdrawal(withdrawalId: string) {
    return this.prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({
        where: { id: withdrawalId },
      });

      if (!withdrawal) {
        throw new Error('Withdrawal not found');
      }

      if (withdrawal.status !== 'PENDING') {
        throw new Error('Withdrawal already processed');
      }

      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'PROCESSING',
        },
      });

      // release balance lock
      await tx.balanceLock.updateMany({
        where: {
          referenceId: withdrawalId,
          reason: 'WITHDRAWAL',
        },
        data: {
          released: true,
        },
      });

      return withdrawal;
    });
  }

  /**
   * Reject withdrawal
   */
  async rejectWithdrawal(withdrawalId: string) {
    return this.prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({
        where: { id: withdrawalId },
      });

      if (!withdrawal) {
        throw new Error('Withdrawal not found');
      }

      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'FAILED',
        },
      });

      // unlock funds
      await tx.balanceLock.updateMany({
        where: {
          referenceId: withdrawalId,
        },
        data: {
          released: true,
        },
      });
    });
  }

  
}
