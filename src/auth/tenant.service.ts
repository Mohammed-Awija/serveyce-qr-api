import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

export interface TenantContext {
  userId: string; // our internal User.id
  clerkUserId: string;
  organizationId: string;
  role: string;
}

@Injectable()
export class TenantService {
  constructor(private readonly users: UsersService) {}

  async resolve(clerkUserId: string): Promise<TenantContext> {
    const user = await this.users.getOrProvision(clerkUserId);
    const membership = user.memberships[0];

    if (!membership) {
      throw new UnauthorizedException('User has no organization membership');
    }

    return {
      userId: user.id,
      clerkUserId,
      organizationId: membership.organizationId,
      role: membership.role,
    };
  }
}
