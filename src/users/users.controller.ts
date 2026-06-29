import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import type { AuthenticatedRequest } from '../auth/clerk-auth.guard';
import { UsersService } from './users.service';

@Controller('me')
@UseGuards(ClerkAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  async getMe(@Req() request: AuthenticatedRequest) {
    const clerkUserId = request.clerkUserId;
    if (!clerkUserId) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    const user = await this.users.getOrProvision(clerkUserId);

    // Shape the response for the frontend
    const primaryMembership = user.memberships[0];
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: primaryMembership
        ? {
            id: primaryMembership.organization.id,
            slug: primaryMembership.organization.slug,
            name: primaryMembership.organization.name,
            kind: primaryMembership.organization.kind,
            role: primaryMembership.role,
          }
        : null,
    };
  }
}