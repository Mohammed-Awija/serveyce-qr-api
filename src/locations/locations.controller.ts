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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('locations')
@UseGuards(TenantGuard)
export class LocationsController {
  constructor(private readonly locations: LocationsService) {}

  @Post()
  create(@CurrentOrg() org: TenantContext, @Body() dto: CreateLocationDto) {
    return this.locations.create(org.organizationId, dto);
  }

  @Get()
  findAll(@CurrentOrg() org: TenantContext) {
    return this.locations.findAll(org.organizationId);
  }

  @Get(':id')
  findOne(@CurrentOrg() org: TenantContext, @Param('id') id: string) {
    return this.locations.findOne(org.organizationId, id);
  }

  @Patch(':id')
  update(
    @CurrentOrg() org: TenantContext,
    @Param('id') id: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.locations.update(org.organizationId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentOrg() org: TenantContext, @Param('id') id: string) {
    return this.locations.remove(org.organizationId, id);
  }

  @Get(':id/offerings')
  getAssignments(@CurrentOrg() org: TenantContext, @Param('id') id: string) {
    return this.locations.getAssignments(org.organizationId, id);
  }

  @Post(':id/offerings/:nodeId')
  assign(
    @CurrentOrg() org: TenantContext,
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
  ) {
    return this.locations.assign(org.organizationId, id, nodeId);
  }

  @Delete(':id/offerings/:nodeId')
  unassign(
    @CurrentOrg() org: TenantContext,
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
  ) {
    return this.locations.unassign(org.organizationId, id, nodeId);
  }
}
