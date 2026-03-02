import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsString, IsNumber } from 'class-validator';

export class WithdrawalDto {

  @ApiProperty({
    example: "wallet_uuid_123",
    description: "Wallet ID"
  })
  @IsString()
  walletId: string;

  @ApiProperty({
    example: 100,
    description: "Withdrawal amount"
  })
  @IsNumber()
  amount: Prisma.Decimal;

  @ApiProperty({
    example: "0xA123bc456WalletAddress",
    description: "Withdrawal address"
  })
  @IsString()
  address: string;

}