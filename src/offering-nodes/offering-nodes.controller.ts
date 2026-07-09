import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { CurrentOrg } from '../auth/current-org.decorator';
import type { TenantContext } from '../auth/tenant.service';
import { OfferingNodesService } from './offering-nodes.service';
import { CreateOfferingNodeDto } from './dto/create-offering-node.dto';
import { UpdateOfferingNodeDto } from './dto/update-offering-node.dto';

@Controller('offering-nodes')
@UseGuards(TenantGuard)
export class OfferingNodesController {
  constructor(private readonly nodes: OfferingNodesService) {}

  @Get('tree')
  findTree(@CurrentOrg() org: TenantContext) {
    return this.nodes.findTree(org.organizationId);
  }

  @Post()
  create(@CurrentOrg() org: TenantContext, @Body() dto: CreateOfferingNodeDto) {
    return this.nodes.create(org.organizationId, dto);
  }

  @Patch(':id')
  update(
    @CurrentOrg() org: TenantContext,
    @Param('id') id: string,
    @Body() dto: UpdateOfferingNodeDto,
  ) {
    return this.nodes.update(org.organizationId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentOrg() org: TenantContext, @Param('id') id: string) {
    return this.nodes.remove(org.organizationId, id);
  }
}
