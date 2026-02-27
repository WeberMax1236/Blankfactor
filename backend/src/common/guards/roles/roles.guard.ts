import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    /*
    Read the roles required by the route
    Example: @Roles(Role.ADMIN)
    */
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    // If route does not require role → allow access
    if (!requiredRoles) {
      return true;
    }

    // Get HTTP request
    const request = context.switchToHttp().getRequest();

    // User is attached by JWT strategy
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    /*
    Check if user role matches required role
    */
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}