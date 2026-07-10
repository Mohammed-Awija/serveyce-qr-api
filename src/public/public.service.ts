import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Given an org slug + location id, return the guest-facing context:
   * org name + location name. Services are fetched separately via the tree.
   */
  async getGuestContext(slug: string, locationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
      select: { id: true, name: true, defaultLanguage: true },
    });
    if (!organization) throw new NotFoundException('Organization not found');

    const location = await this.prisma.location.findFirst({
      where: { id: locationId, organizationId: organization.id },
      select: { id: true, name: true, displayName: true },
    });
    if (!location) throw new NotFoundException('Location not found');

    return {
      organization: {
        name: organization.name,
        defaultLanguage: organization.defaultLanguage,
      },
      location: {
        id: location.id,
        name: location.displayName ?? location.name,
      },
    };
  }

  async getMenuChildren(
    slug: string,
    locationId: string,
    parentId: string | null,
  ) {
    const org = await this.prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!org) throw new NotFoundException('Organization not found');

    // At the top level, only show nodes assigned to this location
    if (parentId === null) {
      const links = await this.prisma.locationOffering.findMany({
        where: { organizationId: org.id, locationId },
        select: { offeringNodeId: true },
      });
      const assignedIds = links.map((l) => l.offeringNodeId);
      if (assignedIds.length === 0) return [];

      return this.prisma.offeringNode.findMany({
        where: {
          organizationId: org.id,
          parentId: null,
          enabled: true,
          id: { in: assignedIds },
        },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
        select: { id: true, name: true, type: true, icon: true },
      });
    }

    // Below the top level, show all enabled children (subtree comes with the assigned top node)
    return this.prisma.offeringNode.findMany({
      where: { organizationId: org.id, parentId, enabled: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, name: true, type: true, icon: true },
    });
  }

  async getItemModifiers(slug: string, itemId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!org) throw new NotFoundException('Organization not found');

    // Verify the item belongs to this org and is an ITEM
    const item = await this.prisma.offeringNode.findFirst({
      where: {
        id: itemId,
        organizationId: org.id,
        type: 'ITEM',
        enabled: true,
      },
      select: { id: true, name: true },
    });
    if (!item) throw new NotFoundException('Item not found');

    const groups = await this.prisma.modifierGroup.findMany({
      where: { organizationId: org.id, offeringNodeId: itemId },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        name: true,
        selectionType: true,
        required: true,
        options: {
          orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
          select: { id: true, name: true },
        },
      },
    });

    return { item, groups };
  }

  async createRequest(
    slug: string,
    locationId: string,
    input: {
      offeringNodeId: string;
      selections?: { groupName: string; optionNames: string[] }[];
      guestName?: string;
      notes?: string;
    },
  ) {
    const org = await this.prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!org) throw new NotFoundException('Organization not found');

    const location = await this.prisma.location.findFirst({
      where: { id: locationId, organizationId: org.id },
      select: { id: true },
    });
    if (!location) throw new NotFoundException('Location not found');

    // Verify the item belongs to this org, is an ITEM, and is enabled
    const item = await this.prisma.offeringNode.findFirst({
      where: {
        id: input.offeringNodeId,
        organizationId: org.id,
        type: 'ITEM',
        enabled: true,
      },
      select: { id: true, name: true },
    });
    if (!item) throw new NotFoundException('Item not available');

    await this.prisma.request.create({
      data: {
        organizationId: org.id,
        locationId,
        offeringNodeId: item.id,
        itemName: item.name,
        selections: input.selections ?? [],
        guestName: input.guestName?.slice(0, 100),
        notes: input.notes?.slice(0, 500),
      },
    });

    return { success: true };
  }
}
