import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from '@prisma/client';
@Controller('users')
export class UsersController {
  //////////////////////////////////////////////////////////////////
  /* All users can access these routes*/
  ///////////////////////////////////////////////////////////////////
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return {
      message: 'Protected profile data',
      user: req.user,
    };
  }

  //////////////////////////////////////////////////////////////////
  /* Only ADMIN users can access these routes*/
  ///////////////////////////////////////////////////////////////////
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  getAdminData(@Req() req) {
    return {
      message: 'Admin data',
      user: req.user,
    };
  }
}