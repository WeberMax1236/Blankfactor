import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/*
This decorator attaches role metadata to routes.

Example:
@Roles(Role.ADMIN)

It tells NestJS that only ADMIN users
can access this route.
*/

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);