import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param
} from '@nestjs/common';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WalletService } from './wallet.service';

import { DepositDto } from './dto/deposit.dto';
import { WithdrawalDto } from './dto/withdrawal.dto';
import { BetDto } from './dto/bet.dto';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {

  constructor(private walletService: WalletService) {}

  /**
   * Get wallet by user + currency
   */
  @Get()
  @ApiOperation({ summary: 'Get wallet by user and currency' })
  getWallet(
    @Query('userId') userId: string,
    @Query('currencyId') currencyId: string,
  ) {
    return this.walletService.getWallet(userId, currencyId);
  }

  /**
   * Get wallet balance
   */
  @Get(':walletId/balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  getBalance(
    @Param('walletId') walletId: string
  ) {
    return this.walletService.getBalance(walletId);
  }

  /**
   * Get available balance
   */
  @Get(':walletId/available')
  @ApiOperation({ summary: 'Get available balance' })
  getAvailableBalance(
    @Param('walletId') walletId: string
  ) {
    return this.walletService.getAvailableBalance(walletId);
  }

  /**
   * Confirm deposit (normally done by blockchain watcher)
   */
  @Post('deposit')
  @ApiOperation({ summary: 'Confirm deposit' })
  confirmDeposit(
    @Body() dto: DepositDto
  ) {
    return this.walletService.confirmDeposit(dto.walletId);
  }

  /**
   * Request withdrawal
   */
  @Post('withdraw')
  @ApiOperation({ summary: 'Create withdrawal request' })
  withdraw(
    @Body() dto: WithdrawalDto
  ) {
    return this.walletService.requestWithdrawal(
      dto.walletId,
      dto.amount as any,
      dto.address
    );
  }

  /**
   * Place bet
   */
  @Post('bet')
  @ApiOperation({ summary: 'Place bet' })
  placeBet(
    @Body() dto: BetDto
  ) {
    return this.walletService.placeBet(
      dto.userId,
      dto.walletId,
      dto.gameId,
      dto.amount as any,
      dto.clientSeed
    );
  }

}