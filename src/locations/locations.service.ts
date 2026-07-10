import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateLocationDto) {
    return this.prisma.location.create({
      data: {
        organizationId,
        name: dto.name,
        kind: dto.kind ?? 'ROOM',
        displayName: dto.displayName,
        notes: dto.notes,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.location.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const location = await this.prisma.location.findFirst({
      where: { id, organizationId },
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return location;
  }

  async update(organizationId: string, id: string, dto: UpdateLocationDto) {
    // ensure it belongs to this org before updating
    await this.findOne(organizationId, id);
    return this.prisma.location.update({
      where: { id },
      data: dto,
    });
  }

  async remove(organizationId: string, id: string) {
    // ensure it belongs to this org before deleting
    await this.findOne(organizationId, id);
    return this.prisma.location.delete({
      where: { id },
    });
  }

  // Top-level nodes for this org, each flagged with whether it's assigned to the given location
  async getAssignments(organizationId: string, locationId: string) {
    await this.findOne(organizationId, locationId);

    const topNodes = await this.prisma.offeringNode.findMany({
      where: { organizationId, parentId: null },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, name: true, type: true },
    });

    const links = await this.prisma.locationOffering.findMany({
      where: { organizationId, locationId },
      select: { offeringNodeId: true },
    });
    const assignedIds = new Set(links.map((l) => l.offeringNodeId));

    return topNodes.map((n) => ({ ...n, assigned: assignedIds.has(n.id) }));
  }

  async assign(
    organizationId: string,
    locationId: string,
    offeringNodeId: string,
  ) {
    await this.findOne(organizationId, locationId);

    const node = await this.prisma.offeringNode.findFirst({
      where: { id: offeringNodeId, organizationId, parentId: null },
    });
    if (!node) {
      throw new NotFoundException('Top-level offering not found');
    }

    // assigning twice is harmless — no duplicate, no error
    await this.prisma.locationOffering.upsert({
      where: { locationId_offeringNodeId: { locationId, offeringNodeId } },
      update: {},
      create: { organizationId, locationId, offeringNodeId },
    });
    return { success: true };
  }

  async unassign(
    organizationId: string,
    locationId: string,
    offeringNodeId: string,
  ) {
    await this.findOne(organizationId, locationId);

    await this.prisma.locationOffering.deleteMany({
      where: { organizationId, locationId, offeringNodeId },
    });
    return { success: true };
  }
}
