import { Controller, Get, Post, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AdminService } from './admin.service'

@ApiTags('Admin')
@Controller('admin')
export class AdminController {

  constructor(private adminService: AdminService) {}

  /**
   * Get users
   */
  @Get('users')
  @ApiOperation({ summary: 'List users' })
  getUsers() {
    return this.adminService.getUsers()
  }

  /**
   * Get withdrawal requests
   */
  @Get('withdrawals')
  @ApiOperation({ summary: 'List withdrawal requests' })
  getWithdrawals() {
    return this.adminService.getWithdrawals()
  }

  /**
   * Approve withdrawal
   */
  @Post('withdrawals/:id/approve')
  @ApiOperation({ summary: 'Approve withdrawal' })
  approveWithdrawal(
    @Param('id') id: string
  ) {
    return this.adminService.approveWithdrawal(id)
  }

  /**
   * Reject withdrawal
   */
  @Post('withdrawals/:id/reject')
  @ApiOperation({ summary: 'Reject withdrawal' })
  rejectWithdrawal(
    @Param('id') id: string
  ) {
    return this.adminService.rejectWithdrawal(id)
  }

}