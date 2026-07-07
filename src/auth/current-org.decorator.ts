import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { TenantContext } from './tenant.service';
import type { TenantRequest } from './tenant.guard';

export const CurrentOrg = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TenantContext | undefined => {
    const request = ctx.switchToHttp().getRequest<TenantRequest>();
    return request.tenant;
  },
);
