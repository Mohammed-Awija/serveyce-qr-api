import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClerkService } from './clerk.service';
import { TenantService, TenantContext } from './tenant.service';

export interface TenantRequest extends Request {
  tenant?: TenantContext;
}

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly clerk: ClerkService,
    private readonly tenant: TenantService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or malformed Authorization header',
      );
    }

    const token = authHeader.substring(7); // strip "Bearer "

    let clerkUserId: string;
    try {
      const verified = await this.clerk.verifyToken(token);
      clerkUserId = verified.sub;
    } catch {
      throw new UnauthorizedException('Invalid session token');
    }

    request.tenant = await this.tenant.resolve(clerkUserId);
    return true;
  }
}
