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
}
