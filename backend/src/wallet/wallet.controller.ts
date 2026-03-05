import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WalletService } from './wallet.service';

import { DepositDto } from './dto/deposit.dto';
import { WithdrawalDto } from './dto/withdrawal.dto';
import { BetDto } from './dto/bet.dto';
import { ConfirmDepositDto } from './dto/confirmdeposit.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  /**
   * Get wallet by user + currency
   */
  @Get()
  @ApiOperation({ summary: 'Get wallet by user and currency' })
  getWallet(@CurrentUser() user, @Query('currencyId') currencyId: string) {
    return this.walletService.getWallet(user.id, currencyId);
  }

  /**
   * Get wallet balance
   */
  @Get(':walletId/balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  async getBalance(@CurrentUser() user, @Param('walletId') walletId: string) {
    const balance = await this.walletService.getBalance(walletId, user.id);

    return {
      walletId,
      balance,
    };
  }

  /**
   * Get available balance
   * available = balance - locked funds
   */
  @Get(':walletId/available')
  @ApiOperation({ summary: 'Get available balance' })
  async getAvailableBalance(
    @CurrentUser() user,
    @Param('walletId') walletId: string,
  ) {
    const available = await this.walletService.getAvailableBalance(
      walletId,
      user.id,
    );

    return {
      walletId,
      available,
    };
  }

  /**
   * Create deposit
   */
  @Post('deposit/create')
  @ApiOperation({ summary: 'Create deposit record' })
  createDeposit(@Body() dto: DepositDto) {
    return this.walletService.createDeposit(
      dto.walletId,
      dto.amount,
      dto.txHash,
    );
  }
  /**
   * Confirm deposit
   *
   * Normally executed by:
   * - blockchain watcher
   * - admin system
   */
  @Post('deposit/confirm')
  @ApiOperation({ summary: 'Confirm deposit (blockchain confirmation)' })
  confirmDeposit(@Body() dto: ConfirmDepositDto) {
    return this.walletService.confirmDeposit(dto.depositId);
  }

  /**
   * Request withdrawal
   */
  @Post('withdraw')
  @ApiOperation({ summary: 'Create withdrawal request' })
  withdraw(@CurrentUser() user, @Body() dto: WithdrawalDto) {
    return this.walletService.requestWithdrawal(
      user.id,
      dto.walletId,
      dto.amount,
      dto.address,
    );
  }

  /**
   * Place bet
   */
  @Post('bet')
  @ApiOperation({ summary: 'Place bet' })
  placeBet(@CurrentUser() user, @Body() dto: BetDto) {
    return this.walletService.placeBet(
      user.id,
      dto.walletId,
      dto.gameId,
      dto.amount,
      dto.clientSeed,
    );
  }
  Decimal;
  /**
   * transaction history for wallet (deposits, withdrawals, bets, wins)
   */
  @Get(':walletId/transactions')
  @ApiOperation({ summary: 'Get wallet transaction history' })
  getTransactions(@Param('walletId') walletId: string) {
    return this.walletService.getTransactions(walletId);
  }
}
