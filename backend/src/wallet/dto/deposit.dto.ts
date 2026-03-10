import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { IsUUID, IsString, IsNumber } from 'class-validator'

export class DepositDto {

  @ApiProperty({
    example: "wallet-uuid"
  })
  @IsUUID()
  walletId: string

  @ApiProperty({
    example: "0.5"
  })
  @IsNumber()
  amount: number

  @ApiProperty({
    example: "0xabc123txhash"
  })
  @IsString()
  txHash: string

}