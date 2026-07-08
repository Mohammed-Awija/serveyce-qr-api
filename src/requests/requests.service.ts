import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.request.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: {
        location: { select: { name: true } },
        offeringType: { select: { name: true, icon: true } },
      },
    });
  }

  async updateStatus(
    organizationId: string,
    id: string,
    status: RequestStatus,
  ) {
    // ensure the request belongs to this org
    const existing = await this.prisma.request.findFirst({
      where: { id, organizationId },
    });
    if (!existing) throw new NotFoundException('Request not found');

    // set timestamps based on the new status
    const data: {
      status: RequestStatus;
      acceptedAt?: Date;
      completedAt?: Date;
    } = { status };

    if (status === 'IN_PROGRESS' && !existing.acceptedAt) {
      data.acceptedAt = new Date();
    }
    if (status === 'DONE' && !existing.completedAt) {
      data.completedAt = new Date();
    }

    return this.prisma.request.update({ where: { id }, data });
  }
}
