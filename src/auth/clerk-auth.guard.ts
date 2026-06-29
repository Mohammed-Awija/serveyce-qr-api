import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClerkService } from './clerk.service';

export interface AuthenticatedRequest extends Request {
  clerkUserId?: string;
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly clerk: ClerkService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or malformed Authorization header',
      );
    }

    const token = authHeader.substring(7); // strip "Bearer "

    try {
      const verified = await this.clerk.verifyToken(token);
      request.clerkUserId = verified.sub;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid session token');
    }
  }
}
