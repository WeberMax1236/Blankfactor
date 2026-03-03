import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { DashboardService } from './dashboard.service'

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {

  constructor(private dashboardService: DashboardService) {}

  /**
   * Get dashboard summary
   */
  @Get('summary')
  @ApiOperation({ summary: 'Get platform summary statistics' })
  getSummary() {
    return this.dashboardService.getSummary()
  }

  /**
   * Get recent ledger transactions
   */
  @Get('recent-transactions')
  @ApiOperation({ summary: 'Get recent financial transactions' })
  getRecentTransactions() {
    return this.dashboardService.getRecentTransactions()
  }

  /**
   * Get recent bets
   */
  @Get('recent-bets')
  @ApiOperation({ summary: 'Get recent bets' })
  getRecentBets() {
    return this.dashboardService.getRecentBets()
  }

}