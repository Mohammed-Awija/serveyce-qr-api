import { Controller, Get, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentOrg } from '../auth/current-org.decorator';
import type { TenantContext } from '../auth/tenant.service';
import { UsersService } from './users.service';

@Controller('me')
@UseGuards(TenantGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  async getMe(@CurrentOrg() org: TenantContext) {
    const user = await this.users.getOrProvision(org.clerkUserId);
    const membership = user.memberships[0];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: membership
        ? {
            id: membership.organization.id,
            slug: membership.organization.slug,
            name: membership.organization.name,
            kind: membership.organization.kind,
            role: membership.role,
          }
        : null,
    };
  }
}
