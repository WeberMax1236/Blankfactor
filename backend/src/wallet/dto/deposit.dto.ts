import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';

export class DepositDto {

  @ApiProperty({
    example: 'wallet-uuid-here',
    description: 'Wallet ID that will receive deposit'
  })
  @IsUUID()
  walletId: string;

  @ApiProperty({
    example: '0xabc123txhash',
    description: 'Blockchain transaction hash'
  })
  @IsString()
  txHash: string;
}