import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Given an org slug + location id, return the guest-facing data:
   * org name, location name, and the ENABLED services only.
   */
  async getGuestContext(slug: string, locationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        defaultLanguage: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Verify the location belongs to this org
    const location = await this.prisma.location.findFirst({
      where: { id: locationId, organizationId: organization.id },
      select: { id: true, name: true, displayName: true },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    // Only enabled services, ordered
    const offerings = await this.prisma.offeringType.findMany({
      where: { organizationId: organization.id, enabled: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, name: true, icon: true },
    });

    return {
      organization: {
        name: organization.name,
        defaultLanguage: organization.defaultLanguage,
      },
      location: { id: location.id, name: location.displayName ?? location.name },
      offerings,
    };
  }

  async createRequest(
    slug: string,
    locationId: string,
    offeringTypeId: string,
    guestName?: string,
    notes?: string,
  ) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!organization) throw new NotFoundException('Organization not found');

    // Verify location belongs to org
    const location = await this.prisma.location.findFirst({
      where: { id: locationId, organizationId: organization.id },
      select: { id: true },
    });
    if (!location) throw new NotFoundException('Location not found');

    // Verify the offering belongs to org AND is enabled
    const offering = await this.prisma.offeringType.findFirst({
      where: {
        id: offeringTypeId,
        organizationId: organization.id,
        enabled: true,
      },
      select: { id: true },
    });
    if (!offering) throw new NotFoundException('Service not available');

    await this.prisma.request.create({
      data: {
        organizationId: organization.id,
        locationId,
        offeringTypeId,
        guestName: guestName?.slice(0, 100),
        notes: notes?.slice(0, 500),
      },
    });

    return { success: true };
  }
}
