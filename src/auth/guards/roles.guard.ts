import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator.js';
import { Role } from '../enums/role.enum.js';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles?.length) {
            return true;
        }

        const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();

        if (!request.user) {
            throw new ForbiddenException('User role is unavailable');
        }

        const userRole = (request.user as AuthenticatedRequest['user'] & {
            role?: Role;
        }).role;

        if (!userRole || !requiredRoles.includes(userRole)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}