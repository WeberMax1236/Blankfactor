import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { DashboardService } from './dashboard.service'

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {

  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Dashboard summary statistics' })
  getSummary() {
    return this.dashboardService.getSummary()
  }

  @Get('recent-transactions')
  @ApiOperation({ summary: 'Recent ledger transactions' })
  getRecentTransactions() {
    return this.dashboardService.getRecentTransactions()
  }

  @Get('recent-bets')
  @ApiOperation({ summary: 'Recent bets' })
  getRecentBets() {
    return this.dashboardService.getRecentBets()
  }

  @Get('today')
  @ApiOperation({ summary: 'Today financial statistics' })
  getTodayStats() {
    return this.dashboardService.getTodayStats()
  }

}