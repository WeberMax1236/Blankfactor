import { ApiProperty } from '@nestjs/swagger'

export class DashboardSummaryDto {

  @ApiProperty({ example: 120 })
  totalUsers: number

  @ApiProperty({ example: 500 })
  totalBets: number

  @ApiProperty({ example: 12000 })
  totalDeposits: number

  @ApiProperty({ example: 8000 })
  totalWithdrawals: number

  @ApiProperty({ example: 4000 })
  houseProfit: number

}