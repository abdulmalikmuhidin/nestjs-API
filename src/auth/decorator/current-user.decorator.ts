import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface.js';

export const CurrentUser = createParamDecorator(
    (data: keyof AuthenticatedRequest['user'] | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

        return data ? request.user?.[data] : request.user;
    },
);