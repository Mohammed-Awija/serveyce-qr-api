import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferingTypeDto } from './dto/create-offering-type.dto';
import { UpdateOfferingTypeDto } from './dto/update-offering-type.dto';

@Injectable()
export class OfferingTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateOfferingTypeDto) {
    return this.prisma.offeringType.create({
      data: {
        organizationId,
        name: dto.name,
        icon: dto.icon ?? 'bell',
        enabled: dto.enabled ?? true,
        displayOrder: dto.displayOrder ?? 0,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.offeringType.findMany({
      where: { organizationId },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(organizationId: string, id: string) {
    const item = await this.prisma.offeringType.findFirst({
      where: { id, organizationId },
    });
    if (!item) throw new NotFoundException('Offering type not found');
    return item;
  }

  async update(organizationId: string, id: string, dto: UpdateOfferingTypeDto) {
    await this.findOne(organizationId, id);
    return this.prisma.offeringType.update({ where: { id }, data: dto });
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    return this.prisma.offeringType.delete({ where: { id } });
  }
}
