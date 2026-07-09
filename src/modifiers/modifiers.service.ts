import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateOptionDto } from './dto/create-option.dto';

@Injectable()
export class ModifiersService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(organizationId: string, dto: CreateGroupDto) {
    // The item must belong to this org AND be an ITEM (not a category)
    const node = await this.prisma.offeringNode.findFirst({
      where: { id: dto.offeringNodeId, organizationId },
    });
    if (!node) throw new NotFoundException('Item not found');
    if (node.type !== 'ITEM') {
      throw new BadRequestException(
        'Modifiers can only be added to items, not categories',
      );
    }

    return this.prisma.modifierGroup.create({
      data: {
        organizationId,
        offeringNodeId: dto.offeringNodeId,
        name: dto.name,
        selectionType: dto.selectionType ?? 'SINGLE',
        required: dto.required ?? false,
        displayOrder: dto.displayOrder ?? 0,
      },
    });
  }

  async createOption(organizationId: string, dto: CreateOptionDto) {
    const group = await this.prisma.modifierGroup.findFirst({
      where: { id: dto.modifierGroupId, organizationId },
    });
    if (!group) throw new NotFoundException('Modifier group not found');

    return this.prisma.modifierOption.create({
      data: {
        organizationId,
        modifierGroupId: dto.modifierGroupId,
        name: dto.name,
        displayOrder: dto.displayOrder ?? 0,
      },
    });
  }

  // All modifier groups (with options) for a given item
  async findGroupsForItem(organizationId: string, offeringNodeId: string) {
    return this.prisma.modifierGroup.findMany({
      where: { organizationId, offeringNodeId },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        options: {
          orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });
  }

  async removeGroup(organizationId: string, id: string) {
    const group = await this.prisma.modifierGroup.findFirst({
      where: { id, organizationId },
    });
    if (!group) throw new NotFoundException('Group not found');
    return this.prisma.modifierGroup.delete({ where: { id } }); // options cascade
  }

  async removeOption(organizationId: string, id: string) {
    const option = await this.prisma.modifierOption.findFirst({
      where: { id, organizationId },
    });
    if (!option) throw new NotFoundException('Option not found');
    return this.prisma.modifierOption.delete({ where: { id } });
  }
}
