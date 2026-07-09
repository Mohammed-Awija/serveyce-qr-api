import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferingNodeDto } from './dto/create-offering-node.dto';
import { UpdateOfferingNodeDto } from './dto/update-offering-node.dto';

@Injectable()
export class OfferingNodesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateOfferingNodeDto) {
    // If a parent is given, verify it belongs to this org and is a CATEGORY
    if (dto.parentId) {
      const parent = await this.prisma.offeringNode.findFirst({
        where: { id: dto.parentId, organizationId },
      });
      if (!parent) throw new NotFoundException('Parent node not found');
      if (parent.type !== 'CATEGORY') {
        throw new BadRequestException('Parent must be a category');
      }
    }

    return this.prisma.offeringNode.create({
      data: {
        organizationId,
        name: dto.name,
        type: dto.type ?? 'ITEM',
        parentId: dto.parentId ?? null,
        icon: dto.icon ?? 'bell',
        enabled: dto.enabled ?? true,
        displayOrder: dto.displayOrder ?? 0,
      },
    });
  }

  // Return the whole tree for this org, nested.
  async findTree(organizationId: string) {
    const all = await this.prisma.offeringNode.findMany({
      where: { organizationId },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });

    // Build a nested structure in memory from the flat list
    type NodeWithChildren = (typeof all)[number] & {
      children: NodeWithChildren[];
    };
    const byId = new Map<string, NodeWithChildren>();
    all.forEach((n) => byId.set(n.id, { ...n, children: [] }));

    const roots: NodeWithChildren[] = [];
    byId.forEach((node) => {
      if (node.parentId) {
        byId.get(node.parentId)?.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async findChildren(organizationId: string, parentId: string | null) {
    return this.prisma.offeringNode.findMany({
      where: { organizationId, parentId },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(organizationId: string, id: string) {
    const node = await this.prisma.offeringNode.findFirst({
      where: { id, organizationId },
    });
    if (!node) throw new NotFoundException('Node not found');
    return node;
  }

  async update(organizationId: string, id: string, dto: UpdateOfferingNodeDto) {
    await this.findOne(organizationId, id);
    return this.prisma.offeringNode.update({ where: { id }, data: dto });
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    // children cascade-delete via the schema relation
    return this.prisma.offeringNode.delete({ where: { id } });
  }
}
